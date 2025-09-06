# Swift Firebase Integration for FosterLinks

This guide provides instructions for integrating Firebase into a Swift application that connects to the same FosterLinks Firebase backend.

## Setup Steps

The primary method for configuring Firebase in a native iOS app is by using the `GoogleService-Info.plist` file, which securely contains all the necessary keys and identifiers. The `FirebaseApp.configure()` method in your code will automatically use this file.

### 1. Install Firebase SDK

Add Firebase to your Swift project using Swift Package Manager:

1. In Xcode, go to File > Add Packages...
2. Enter the Firebase iOS SDK repository URL: `https://github.com/firebase/firebase-ios-sdk.git`
3. Select the Firebase packages you need:
   - FirebaseAuth
   - FirebaseFirestore
   - FirebaseStorage (if needed)
   - FirebaseAnalytics (if needed)

### 2. Configure Firebase in Your App

Create a new Swift file called `FirebaseManager.swift` with the following content:

```swift
import SwiftUI
import FirebaseCore
import FirebaseAuth
import FirebaseFirestore

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    return true
  }
}

@main
struct FosterLinksApp: App {
  // Register app delegate for Firebase setup
  @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
  
  var body: some Scene {
    WindowGroup {
      NavigationView {
        ContentView()
      }
    }
  }
}
```

### 3. Download GoogleService-Info.plist

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "fosterlinks-95182"
3. Go to Project Settings > Your Apps
4. If an iOS app is not already registered, add a new iOS app
5. Download the `GoogleService-Info.plist` file
6. Add this file to your Xcode project (make sure to check "Copy items if needed")

### 4. Create Firebase Service Classes

Create service classes to interact with Firebase:

#### Authentication Service

```swift
import FirebaseAuth

class AuthService {
    static let shared = AuthService()
    
    private init() {}
    
    func signIn(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            if let user = result?.user {
                completion(.success(user))
            }
        }
    }
    
    func signOut() throws {
        try Auth.auth().signOut()
    }
    
    var currentUser: User? {
        return Auth.auth().currentUser
    }
}
```

#### Firestore Service

```swift
import FirebaseFirestore

class FirestoreService {
    static let shared = FirestoreService()
    
    private let db = Firestore.firestore()
    
    private init() {}
    
    // Example: Fetch youth profiles
    func fetchYouthProfiles(completion: @escaping (Result<[YouthProfile], Error>) -> Void) {
        db.collection("youth").getDocuments { snapshot, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let documents = snapshot?.documents else {
                completion(.success([]))
                return
            }
            
            let youthProfiles = documents.compactMap { document -> YouthProfile? in
                try? document.data(as: YouthProfile.self)
            }
            
            completion(.success(youthProfiles))
        }
    }
    
    // Add more methods as needed for your specific data requirements
}
```

### 5. Create Data Models

Create Swift models that match your Firestore data structure:

```swift
import FirebaseFirestoreSwift

struct YouthProfile: Identifiable, Codable {
    @DocumentID var id: String?
    var firstName: String
    var lastName: String
    var dateOfBirth: Date
    var gender: String
    var caseNumber: String?
    var fosterParentId: String?
    var notes: String?
    
    // Add more fields as needed to match your Firestore schema
}

// Add more models as needed
```

## Usage Examples

### Authentication

```swift
import SwiftUI

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage = ""
    @State private var isAuthenticated = false
    
    var body: some View {
        VStack {
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .autocapitalization(.none)
            
            SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
            }
            
            Button("Sign In") {
                AuthService.shared.signIn(email: email, password: password) { result in
                    switch result {
                    case .success(_):
                        isAuthenticated = true
                    case .failure(let error):
                        errorMessage = error.localizedDescription
                    }
                }
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            NavigationLink(destination: DashboardView(), isActive: $isAuthenticated) {
                EmptyView()
            }
        }
        .padding()
        .navigationTitle("Login")
    }
}
```

### Fetching Data

```swift
import SwiftUI

struct YouthListView: View {
    @State private var youthProfiles: [YouthProfile] = []
    @State private var isLoading = false
    @State private var errorMessage = ""
    
    var body: some View {
        List {
            if isLoading {
                ProgressView()
            } else if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
            } else {
                ForEach(youthProfiles) { youth in
                    NavigationLink(destination: YouthDetailView(youth: youth)) {
                        VStack(alignment: .leading) {
                            Text("\(youth.firstName) \(youth.lastName)")
                                .font(.headline)
                            Text("Case #: \(youth.caseNumber ?? "N/A")")
                                .font(.subheadline)
                        }
                    }
                }
            }
        }
        .navigationTitle("Youth Profiles")
        .onAppear {
            loadYouthProfiles()
        }
    }
    
    private func loadYouthProfiles() {
        isLoading = true
        
        FirestoreService.shared.fetchYouthProfiles { result in
            isLoading = false
            
            switch result {
            case .success(let profiles):
                youthProfiles = profiles
            case .failure(let error):
                errorMessage = error.localizedDescription
            }
        }
    }
}
```

## Important Notes

1. **Security Rules**: Ensure your Firebase security rules are configured to allow access from your iOS app.

2. **Data Consistency**: Maintain the same data structure between your React, FlutterFlow, and Swift applications.

3. **Authentication**: Use the same authentication methods across all platforms.

4. **Error Handling**: Implement proper error handling for Firebase operations.

5. **Offline Support**: Consider implementing offline support using Firestore's offline capabilities.

## Troubleshooting

If you encounter issues:

1. Verify that `GoogleService-Info.plist` is correctly added to your project
2. Check that all Firebase dependencies are properly installed
3. Ensure you have the correct Firebase configuration
4. Check the Xcode console for any Firebase-related errors
5. Verify network connectivity and Firebase project status

## Additional Resources

- [Firebase iOS Documentation](https://firebase.google.com/docs/ios/setup)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Firebase Swift Package](https://github.com/firebase/firebase-ios-sdk)
