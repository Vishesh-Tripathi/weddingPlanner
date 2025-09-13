# Wedding Planner App

A React Native Expo application for managing wedding guests with manual entry and API integration features.

## Features

### Core Features
- **Guest Manual Entry**: Add guests with name and RSVP status (Yes/No/Maybe)
- **Guest List Management**: View all guests in a clean, organized list
- **Delete Guests**: Remove guests from the list with confirmation
- **Guest Statistics**: Display total guests and RSVP status breakdown
- **Random Guest API**: Add random guests using the RandomUser.me API
- **Persistent Storage**: Guests are saved locally using AsyncStorage

### Bonus Features
- **Search Functionality**: Search guests by name
- **Filter Functionality**: Filter guests by RSVP status (All/Yes/No/Maybe)
- **Interactive RSVP Updates**: Change guest RSVP status directly from the list
- **Error Handling**: Comprehensive error handling for API calls and user interactions
- **Loading States**: Visual feedback for API operations

## Screenshots

### Main Screen
<img width="365" height="791" alt="image" src="https://github.com/user-attachments/assets/d581206c-800a-49a6-a161-5683172e9f0e" />

*The main dashboard showing guest statistics and action buttons*

### Guest List
<img width="354" height="375" alt="image" src="https://github.com/user-attachments/assets/3a66e753-b610-49a0-9cb9-c19e56bfc975" />

*Complete guest list with RSVP status and management options*

### Add Guest Modal
<img width="336" height="342" alt="image" src="https://github.com/user-attachments/assets/fe0916d2-670f-4ff2-938d-82d641519a30" />

*Modal for manually adding new guests*

### Search and Filter
<img width="329" height="333" alt="image" src="https://github.com/user-attachments/assets/8c9f97fe-fd25-4175-ac58-ce640dd72820" />

*Search functionality and RSVP status filters*

## Tech Stack

- **React Native**: Cross-platform mobile app development
- **Expo**: Development platform and toolchain
- **AsyncStorage**: Local data persistence
- **RandomUser.me API**: External API for random guest generation
- **JavaScript/ES6+**: Programming language

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Expo CLI (install with `npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weddingPlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator (macOS only)
   - Press 'w' for web browser

## Project Structure

```
weddingPlanner/
├── App.js                 # Main application component
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── assets/              # Static assets (images, fonts)
├── screenshots/         # App screenshots for documentation
└── README.md           # Project documentation
```

## API Integration

The app uses the [RandomUser.me API](https://randomuser.me/api/) to fetch random user data for the "Add Random Guest" feature. The API provides:

- Random user names (first and last)
- Automatic RSVP status set to "Maybe"
- Error handling for network issues

### API Endpoint
```
GET https://randomuser.me/api/
```

## Key Components & Features

### Guest Management
- Add guests manually with custom names
- Set initial RSVP status (Yes/No/Maybe)
- Update RSVP status for existing guests
- Delete guests with confirmation dialog

### Data Persistence
- All guest data is stored locally using AsyncStorage
- Data persists between app sessions
- Automatic save on any data changes

### Search & Filter
- Real-time search by guest name
- Filter by RSVP status
- Combined search and filter functionality

### Statistics Dashboard
- Total guest count
- Confirmed (Yes) count
- Declined (No) count
- Maybe responses count
- Color-coded statistics

## Error Handling

The app includes comprehensive error handling for:

- Network connectivity issues
- API request failures
- Invalid user inputs
- Storage operations
- Empty states

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA (requires Apple Developer account)
```bash
expo build:ios
```

### Web Build
```bash
expo build:web
```

## Testing

The app has been tested on:
- Android devices (various screen sizes)
- iOS devices (iPhone/iPad)
- Web browsers
- Various network conditions

## Future Enhancements

Potential features for future versions:
- Guest photo upload
- Email invitations
- Wedding venue information
- Guest dietary preferences
- Seating arrangement planner
- RSVP deadline notifications

## Dependencies

### Core Dependencies
- `react-native`: Cross-platform mobile framework
- `expo`: Development and build platform
- `@react-native-async-storage/async-storage`: Local storage solution

### Dev Dependencies
- `@babel/core`: JavaScript compiler
- Various Expo development tools

## License

This project is created for educational purposes as part of an internship assignment.

## Support

For any issues or questions, please refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [RandomUser.me API Documentation](https://randomuser.me/documentation)

## Author

Created as part of an App Development Internship Task.

---

**Note**: Make sure to have a stable internet connection when using the "Add Random Guest" feature as it requires API access.
