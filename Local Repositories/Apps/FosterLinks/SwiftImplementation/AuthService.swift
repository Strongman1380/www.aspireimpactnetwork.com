import FirebaseAuth
import Combine

class AuthService: ObservableObject {
    static let shared = AuthService()
    
    @Published var currentUser: User?
    @Published var userRole: String?
    @Published var isLoading = true
    
    private var authStateListener: AuthStateDidChangeListenerHandle?
    
    private init() {
        authStateListener = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            self?.currentUser = user
            
            if let user = user {
                self?.fetchUserRole(uid: user.uid)
            } else {
                self?.userRole = nil
                self?.isLoading = false
            }
        }
    }
    
    deinit {
        if let authStateListener = authStateListener {
            Auth.auth().removeStateDidChangeListener(authStateListener)
        }
    }
    
    func fetchUserRole(uid: String) {
        FirestoreService.shared.fetchUserRole(uid: uid) { [weak self] role, error in
            if let error = error {
                print("Error fetching user role: \(error.localizedDescription)")
                // For development, assign a default role
                self?.userRole = "admin"
            } else {
                self?.userRole = role
            }
            
            self?.isLoading = false
        }
    }
    
    func signIn(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            if let user = result?.user {
                completion(.success(user))
            } else {
                completion(.failure(NSError(domain: "AuthService", code: 500, userInfo: [NSLocalizedDescriptionKey: "Unknown error occurred"])))
            }
        }
    }
    
    // Modern async/await version
    func signIn(email: String, password: String) async throws -> User {
        let result = try await Auth.auth().signIn(withEmail: email, password: password)
        return result.user
    }
    
    func signOut() throws {
        try Auth.auth().signOut()
    }
    
    var isAuthenticated: Bool {
        return currentUser != nil
    }
}