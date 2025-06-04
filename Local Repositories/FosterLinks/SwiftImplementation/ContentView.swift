import SwiftUI
import FirebaseAuth
import FirebaseFirestore

struct ContentView: View {
    @StateObject private var authService = AuthService.shared
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage = ""
    @State private var isSigningIn = false
    
    var body: some View {
        Group {
            if authService.isLoading {
                LoadingView()
            } else if authService.isAuthenticated {
                DashboardView()
            } else {
                VStack(spacing: 20) {
                    Text("FosterLinks")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    TextField("Email", text: $email)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .autocapitalization(.none)
                        .keyboardType(.emailAddress)
                        .padding(.horizontal)
                        .disabled(isSigningIn)
                    
                    SecureField("Password", text: $password)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                        .disabled(isSigningIn)
                    
                    if !errorMessage.isEmpty {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    
                    Button(action: signIn) {
                        if isSigningIn {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Sign In")
                                .fontWeight(.semibold)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .padding(.horizontal)
                    .disabled(isSigningIn || email.isEmpty || password.isEmpty)
                }
                .padding()
            }
        }
    }
    
    private func signIn() {
        isSigningIn = true
        errorMessage = ""
        
        authService.signIn(email: email, password: password) { result in
            isSigningIn = false
            
            switch result {
            case .success(_):
                // Authentication successful, AuthService will update isAuthenticated
                break
            case .failure(let error):
                errorMessage = error.localizedDescription
            }
        }
    }
}

struct DashboardView: View {
    @State private var youthProfiles: [YouthProfile] = []
    @State private var isLoading = true
    
    var body: some View {
        TabView {
            YouthListView(youthProfiles: youthProfiles, isLoading: isLoading)
                .tabItem {
                    Label("Youth", systemImage: "person.3")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
        .onAppear {
            fetchYouthProfiles()
        }
    }
    
    private func fetchYouthProfiles() {
        let db = Firestore.firestore()
        
        db.collection("youth_profiles").getDocuments { snapshot, error in
            isLoading = false
            
            if let error = error {
                print("Error fetching youth profiles: \(error.localizedDescription)")
                return
            }
            
            guard let documents = snapshot?.documents else {
                return
            }
            
            self.youthProfiles = documents.compactMap { document in
                let data = document.data()
                
                return YouthProfile(
                    id: document.documentID,
                    firstName: data["first_name"] as? String ?? "",
                    lastName: data["last_name"] as? String ?? "",
                    dateOfBirth: (data["dob"] as? Timestamp)?.dateValue() ?? Date(),
                    gender: data["gender"] as? String ?? "",
                    caseNumber: data["case_number"] as? String,
                    fosterParentId: data["fosterParentId"] as? String,
                    notes: data["notes"] as? String
                )
            }
        }
    }
}

struct YouthListView: View {
    let youthProfiles: [YouthProfile]
    let isLoading: Bool
    
    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Loading youth profiles...")
                } else if youthProfiles.isEmpty {
                    Text("No youth profiles found")
                        .foregroundColor(.secondary)
                } else {
                    List(youthProfiles) { youth in
                        NavigationLink(destination: YouthDetailView(youth: youth)) {
                            VStack(alignment: .leading) {
                                Text("\(youth.firstName) \(youth.lastName)")
                                    .font(.headline)
                                Text("Case #: \(youth.caseNumber ?? "N/A")")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
            }
            .navigationTitle("Youth Profiles")
            .toolbar {
                Button(action: {
                    // Add new youth profile
                }) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}

struct YouthDetailView: View {
    let youth: YouthProfile
    
    var body: some View {
        List {
            Section(header: Text("Personal Information")) {
                DetailRow(label: "First Name", value: youth.firstName)
                DetailRow(label: "Last Name", value: youth.lastName)
                DetailRow(label: "Date of Birth", value: formatDate(youth.dateOfBirth))
                DetailRow(label: "Gender", value: youth.gender)
            }
            
            Section(header: Text("Case Information")) {
                DetailRow(label: "Case Number", value: youth.caseNumber ?? "N/A")
            }
            
            if let notes = youth.notes, !notes.isEmpty {
                Section(header: Text("Notes")) {
                    Text(notes)
                        .font(.body)
                }
            }
        }
        .navigationTitle("\(youth.firstName) \(youth.lastName)")
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

struct DetailRow: View {
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

struct SettingsView: View {
    var body: some View {
        NavigationView {
            List {
                Button(action: signOut) {
                    Text("Sign Out")
                        .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
        }
    }
    
    private func signOut() {
        do {
            try Auth.auth().signOut()
        } catch {
            print("Error signing out: \(error.localizedDescription)")
        }
    }
}

struct YouthProfile: Identifiable {
    let id: String
    let firstName: String
    let lastName: String
    let dateOfBirth: Date
    let gender: String
    let caseNumber: String?
    let fosterParentId: String?
    let notes: String?
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}