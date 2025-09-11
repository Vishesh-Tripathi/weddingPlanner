import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('Maybe');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const STORAGE_KEY = '@wedding_guests';

  // Load guests from storage on app start
  useEffect(() => {
    loadGuests();
  }, []);

  // Save guests to storage whenever guests array changes
  useEffect(() => {
    saveGuests();
  }, [guests]);

  const loadGuests = async () => {
    try {
      const storedGuests = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGuests) {
        setGuests(JSON.parse(storedGuests));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load guests');
    }
  };

  const saveGuests = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (error) {
      Alert.alert('Error', 'Failed to save guests');
    }
  };

  const addGuest = () => {
    if (!guestName.trim()) {
      Alert.alert('Error', 'Please enter a guest name');
      return;
    }

    const newGuest = {
      id: Date.now().toString(),
      name: guestName.trim(),
      rsvp: rsvpStatus,
      addedDate: new Date().toLocaleDateString(),
    };

    setGuests([...guests, newGuest]);
    setGuestName('');
    setRsvpStatus('Maybe');
    Alert.alert('Success', 'Guest added successfully!');
  };

  const addRandomGuest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const user = data.results[0];
        const fullName = `${user.name.first} ${user.name.last}`;
        
        const newGuest = {
          id: Date.now().toString(),
          name: fullName,
          rsvp: 'Maybe',
          addedDate: new Date().toLocaleDateString(),
          isRandom: true,
        };

        setGuests([...guests, newGuest]);
        Alert.alert('Success', `Added random guest: ${fullName}`);
      } else {
        Alert.alert('Error', 'No user data received from API');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch random guest. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGuest = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setGuests(guests.filter(guest => guest.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const updateGuestRSVP = (id, newStatus) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, rsvp: newStatus } : guest
    ));
  };

  const getFilteredGuests = () => {
    let filtered = guests;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(guest => guest.rsvp === filterStatus);
    }

    return filtered;
  };

  const getGuestStats = () => {
    const total = guests.length;
    const confirmed = guests.filter(guest => guest.rsvp === 'Yes').length;
    const declined = guests.filter(guest => guest.rsvp === 'No').length;
    const maybe = guests.filter(guest => guest.rsvp === 'Maybe').length;

    return { total, confirmed, declined, maybe };
  };

  const stats = getGuestStats();
  const filteredGuests = getFilteredGuests();

  const renderGuest = ({ item }) => (
    <View style={styles.guestCard}>
      <View style={styles.guestInfo}>
        <Text style={styles.guestName}>{item.name}</Text>
        <Text style={styles.guestDate}>Added: {item.addedDate}</Text>
        {item.isRandom && <Text style={styles.randomTag}>Random Guest</Text>}
      </View>
      
      <View style={styles.rsvpContainer}>
        <Text style={styles.rsvpLabel}>RSVP:</Text>
        <View style={styles.rsvpButtons}>
          {['Yes', 'No', 'Maybe'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.rsvpButton,
                item.rsvp === status && styles.activeRsvpButton,
                item.rsvp === status && status === 'Yes' && { backgroundColor: '#28a745', borderColor: '#28a745' },
                item.rsvp === status && status === 'No' && { backgroundColor: '#dc3545', borderColor: '#dc3545' },
                item.rsvp === status && status === 'Maybe' && { backgroundColor: '#ffc107', borderColor: '#ffc107' },
              ]}
              onPress={() => updateGuestRSVP(item.id, status)}
            >
              <Text style={[
                styles.rsvpButtonText,
                item.rsvp === status && { color: '#fff', fontWeight: 'bold' }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {deleteConfirmId === item.id ? (
        <View style={styles.deleteConfirmation}>
          <Text style={styles.deleteConfirmText}>Delete this guest?</Text>
          <View style={styles.deleteConfirmButtons}>
            <TouchableOpacity
              style={[styles.deleteConfirmButton, styles.cancelDeleteButton]}
              onPress={cancelDelete}
            >
              <Text style={styles.cancelDeleteText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteConfirmButton, styles.confirmDeleteButton]}
              onPress={confirmDelete}
            >
              <Text style={styles.confirmDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteGuest(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Wedding Planner</Text>
        <Text style={styles.subtitle}>Guest Management</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.confirmedText]}>{stats.confirmed}</Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.declinedText]}>{stats.declined}</Text>
          <Text style={styles.statLabel}>Declined</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.maybeText]}>{stats.maybe}</Text>
          <Text style={styles.statLabel}>Maybe</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.primaryButtonText}>Add Guest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.primaryButton, styles.randomButton]}
          onPress={addRandomGuest}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Add Random Guest</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search guests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          {['All', 'Yes', 'No', 'Maybe'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.activeFilterButton
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.activeFilterButtonText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Guest List */}
      <FlatList
        data={filteredGuests}
        renderItem={renderGuest}
        keyExtractor={item => item.id}
        style={styles.guestList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No guests found</Text>
            <Text style={styles.emptySubtext}>Add your first guest to get started!</Text>
          </View>
        }
      />

      {/* Add Guest Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Guest</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Guest Name"
              value={guestName}
              onChangeText={setGuestName}
            />
            
            <Text style={styles.inputLabel}>RSVP Status:</Text>
            <View style={styles.rsvpSelection}>
              {['Yes', 'No', 'Maybe'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.rsvpSelectButton,
                    rsvpStatus === status && styles.activeRsvpSelectButton,
                    status === 'Yes' && styles.yesSelectButton,
                    status === 'No' && styles.noSelectButton,
                    status === 'Maybe' && styles.maybeSelectButton,
                  ]}
                  onPress={() => setRsvpStatus(status)}
                >
                  <Text style={[
                    styles.rsvpSelectButtonText,
                    rsvpStatus === status && styles.activeRsvpSelectButtonText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setGuestName('');
                  setRsvpStatus('Maybe');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={() => {
                  addGuest();
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.addButtonText}>Add Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  confirmedText: {
    color: '#28a745',
  },
  declinedText: {
    color: '#dc3545',
  },
  maybeText: {
    color: '#ffc107',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  randomButton: {
    backgroundColor: '#28a745',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchFilterContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  activeFilterButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  guestList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  guestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guestInfo: {
    marginBottom: 10,
  },
  guestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  guestDate: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  randomTag: {
    fontSize: 10,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 2,
  },
  rsvpContainer: {
    marginBottom: 10,
  },
  rsvpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  rsvpButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rsvpButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#f8f9fa',
  },
  activeRsvpButton: {
    borderWidth: 2,
  },
  yesButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  noButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  maybeButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  rsvpButtonText: {
    fontSize: 12,
    color: '#6c757d',
  },
  activeRsvpButtonText: {
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteConfirmation: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  deleteConfirmText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  deleteConfirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deleteConfirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelDeleteButton: {
    backgroundColor: '#6c757d',
  },
  confirmDeleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelDeleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmDeleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  rsvpSelection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  rsvpSelectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  activeRsvpSelectButton: {
    borderColor: 'transparent',
  },
  yesSelectButton: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  noSelectButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  maybeSelectButton: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  rsvpSelectButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeRsvpSelectButtonText: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  addButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
