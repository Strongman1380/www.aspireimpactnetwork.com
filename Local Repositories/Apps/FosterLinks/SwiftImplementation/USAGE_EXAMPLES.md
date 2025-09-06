# FosterLinks Swift Implementation - Usage Examples

This document provides practical examples of how to use the enhanced Swift components in your FosterLinks iOS application.

## Authentication Examples

### Basic Sign In
```swift
import SwiftUI

struct LoginExampleView: View {
    @EnvironmentObject var authService: AuthService
    @State private var email = ""
    @State private var password = ""
    @State private var isAuthenticating = false
    @State private var errorMessage = ""
    
    var body: some View {
        VStack {
            TextField("Email", text: $email)
            SecureField("Password", text: $password)
            
            Button("Sign In") {
                signIn()
            }
            .disabled(isAuthenticating)
        }
    }
    
    private func signIn() {
        isAuthenticating = true
        
        Task {
            do {
                _ = try await authService.signIn(email: email, password: password)
                // Success - auth state change will be handled automatically
            } catch {
                errorMessage = error.localizedDescription
            }
            isAuthenticating = false
        }
    }
}
```

### Check Authentication State
```swift
struct ContentExampleView: View {
    @EnvironmentObject var authService: AuthService
    
    var body: some View {
        Group {
            if authService.isLoading {
                ProgressView("Loading...")
            } else if authService.isAuthenticated {
                DashboardView()
            } else {
                LoginView()
            }
        }
    }
}
```

## Firestore Service Examples

### Fetching Youth Profiles (Modern Async/Await)
```swift
class YouthViewModel: ObservableObject {
    @Published var youthProfiles: [YouthProfile] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func loadYouthProfiles() {
        isLoading = true
        
        Task {
            do {
                let profiles = try await FirestoreService.shared.fetchYouthProfiles()
                await MainActor.run {
                    self.youthProfiles = profiles
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
}
```

### Creating a New Youth Profile
```swift
func createNewYouthProfile() {
    let newProfile = YouthProfile(
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: Date(),
        gender: "Male",
        caseNumber: "CASE-001",
        fosterParentId: nil,
        notes: "Initial intake notes"
    )
    
    Task {
        do {
            let profileId = try await FirestoreService.shared.createYouthProfile(newProfile)
            print("Created profile with ID: \(profileId)")
        } catch {
            print("Error creating profile: \(error)")
        }
    }
}
```

### Real-time Youth Profiles Listener
```swift
class YouthListViewModel: ObservableObject {
    @Published var youthProfiles: [YouthProfile] = []
    private var listener: ListenerRegistration?
    
    func startListening() {
        listener = FirestoreService.shared.listenToYouthProfiles { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let profiles):
                    self.youthProfiles = profiles
                case .failure(let error):
                    print("Error listening to profiles: \(error)")
                }
            }
        }
    }
    
    func stopListening() {
        listener?.remove()
        listener = nil
    }
    
    deinit {
        stopListening()
    }
}
```

## Theme Management Examples

### Using Theme Manager in Views
```swift
struct ThemedButtonView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button("Themed Button") {
            // Button action
        }
        .foregroundColor(.white)
        .background(themeManager.primaryColor)
        .cornerRadius(8)
    }
}
```

### Customizing Theme Settings
```swift
struct CustomThemeView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack {
            // Color selection
            HStack {
                ForEach(themeManager.primaryColorOptions, id: \.name) { option in
                    Button(option.name) {
                        withAnimation {
                            themeManager.primaryColor = option.color
                        }
                    }
                    .foregroundColor(option.color)
                }
            }
            
            // Dark mode toggle
            Toggle("Dark Mode", isOn: $themeManager.isDarkMode)
            
            // Reset button
            Button("Reset to Defaults") {
                themeManager.resetToDefaults()
            }
        }
    }
}
```

## Medication Logging Examples

### Adding a Medication Log
```swift
func addMedicationLog(for youthId: String) {
    let medicationLog = MedicationLog(
        youthId: youthId,
        medicationName: "Ibuprofen",
        dosage: "200mg",
        frequency: "Twice daily",
        administeredBy: Auth.auth().currentUser?.uid ?? "",
        administeredAt: Date(),
        notes: "Given with food",
        createdAt: Date()
    )
    
    Task {
        do {
            let logId = try await FirestoreService.shared.createMedicationLog(medicationLog)
            print("Created medication log with ID: \(logId)")
        } catch {
            print("Error creating medication log: \(error)")
        }
    }
}
```

### Fetching Medication History
```swift
class MedicationViewModel: ObservableObject {
    @Published var medicationLogs: [MedicationLog] = []
    
    func loadMedicationHistory(for youthId: String) {
        Task {
            do {
                let logs = try await FirestoreService.shared.fetchMedicationLogs(for: youthId)
                await MainActor.run {
                    self.medicationLogs = logs
                }
            } catch {
                print("Error loading medication history: \(error)")
            }
        }
    }
}
```

## Activity Logging Examples

### Creating Activity Logs
```swift
func logActivity(for youthId: String, type: ActivityType, description: String) {
    let activityLog = ActivityLog(
        youthId: youthId,
        activityType: type,
        description: description,
        performedBy: Auth.auth().currentUser?.uid ?? "",
        performedAt: Date(),
        metadata: ["source": "iOS App"]
    )
    
    Task {
        do {
            _ = try await FirestoreService.shared.createActivityLog(activityLog)
        } catch {
            print("Error logging activity: \(error)")
        }
    }
}

// Usage examples
logActivity(for: "youth123", type: .medicationAdministered, description: "Administered morning medication")
logActivity(for: "youth123", type: .noteAdded, description: "Added behavioral observation note")
```

## Complete View Example

### Youth Detail View with All Features
```swift
struct YouthDetailExampleView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @StateObject private var medicationViewModel = MedicationViewModel()
    
    let youth: YouthProfile
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack {
                    Circle()
                        .fill(themeManager.primaryColor)
                        .frame(width: 60, height: 60)
                        .overlay(
                            Text(youth.firstName.prefix(1) + youth.lastName.prefix(1))
                                .foregroundColor(.white)
                                .font(.title2)
                        )
                    
                    VStack(alignment: .leading) {
                        Text(youth.fullName)
                            .font(.title2)
                            .fontWeight(.bold)
                        Text("Age: \(youth.age)")
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                }
                
                // Information sections
                InfoSection(title: "Personal Information") {
                    InfoRow(label: "Date of Birth", value: formatDate(youth.dateOfBirth))
                    InfoRow(label: "Gender", value: youth.gender)
                    InfoRow(label: "Case Number", value: youth.caseNumber ?? "N/A")
                }
                
                // Medication history
                InfoSection(title: "Recent Medications") {
                    ForEach(medicationViewModel.medicationLogs.prefix(3)) { log in
                        MedicationRowView(log: log)
                    }
                }
                
                // Action buttons
                HStack {
                    Button("Add Medication") {
                        // Add medication action
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(themeManager.primaryColor)
                    
                    Button("Add Note") {
                        // Add note action
                    }
                    .buttonStyle(.bordered)
                    .tint(themeManager.secondaryColor)
                }
            }
            .padding()
        }
        .navigationTitle(youth.fullName)
        .onAppear {
            medicationViewModel.loadMedicationHistory(for: youth.id ?? "")
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

struct InfoSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            VStack(alignment: .leading, spacing: 4) {
                content
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
        }
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
    }
}
```

## Error Handling Best Practices

### Comprehensive Error Handling
```swift
enum FosterLinksError: LocalizedError {
    case networkError
    case authenticationRequired
    case insufficientPermissions
    case dataCorrupted
    
    var errorDescription: String? {
        switch self {
        case .networkError:
            return "Network connection error. Please check your internet connection."
        case .authenticationRequired:
            return "Please sign in to continue."
        case .insufficientPermissions:
            return "You don't have permission to perform this action."
        case .dataCorrupted:
            return "Data appears to be corrupted. Please try again."
        }
    }
}

// Usage in ViewModels
class SafeViewModel: ObservableObject {
    @Published var errorMessage: String?
    @Published var isLoading = false
    
    func performSafeOperation() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                // Perform operation
                try await someAsyncOperation()
                
                await MainActor.run {
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
}
```

These examples demonstrate the proper usage of the enhanced FosterLinks Swift components, showcasing modern Swift patterns, proper error handling, and effective state management.