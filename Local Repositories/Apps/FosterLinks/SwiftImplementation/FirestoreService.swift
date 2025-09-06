import FirebaseFirestore
import FirebaseAuth
import Combine

class FirestoreService: ObservableObject {
    static let shared = FirestoreService()
    
    private let db = Firestore.firestore()
    
    private init() {}
    
    // MARK: - User Management
    
    func fetchUserRole(uid: String, completion: @escaping (String?, Error?) -> Void) {
        db.collection("users").document(uid).getDocument { document, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let document = document, document.exists else {
                completion(nil, NSError(domain: "FirestoreService", code: 404, userInfo: [NSLocalizedDescriptionKey: "User document not found"]))
                return
            }
            
            let role = document.data()?["role"] as? String ?? "admin"
            completion(role, nil)
        }
    }
    
    func fetchUserProfile(uid: String) async throws -> UserProfile? {
        let document = try await db.collection("users").document(uid).getDocument()
        return try document.data(as: UserProfile.self)
    }
    
    func createUserProfile(_ profile: UserProfile) async throws {
        guard let id = profile.id else {
            throw NSError(domain: "FirestoreService", code: 400, userInfo: [NSLocalizedDescriptionKey: "User profile must have an ID"])
        }
        try db.collection("users").document(id).setData(from: profile)
    }
    
    func updateUserProfile(_ profile: UserProfile) async throws {
        guard let id = profile.id else {
            throw NSError(domain: "FirestoreService", code: 400, userInfo: [NSLocalizedDescriptionKey: "User profile must have an ID"])
        }
        try db.collection("users").document(id).setData(from: profile, merge: true)
    }
    
    // MARK: - Youth Profiles
    
    func fetchYouthProfiles(completion: @escaping (Result<[YouthProfile], Error>) -> Void) {
        db.collection("youth_profiles").getDocuments { snapshot, error in
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
    
    func fetchYouthProfiles() async throws -> [YouthProfile] {
        let snapshot = try await db.collection("youth_profiles").getDocuments()
        return snapshot.documents.compactMap { document in
            try? document.data(as: YouthProfile.self)
        }
    }
    
    func fetchYouthProfile(id: String) async throws -> YouthProfile? {
        let document = try await db.collection("youth_profiles").document(id).getDocument()
        return try document.data(as: YouthProfile.self)
    }
    
    func createYouthProfile(_ profile: YouthProfile) async throws -> String {
        let docRef = try db.collection("youth_profiles").addDocument(from: profile)
        return docRef.documentID
    }
    
    func updateYouthProfile(_ profile: YouthProfile) async throws {
        guard let id = profile.id else {
            throw NSError(domain: "FirestoreService", code: 400, userInfo: [NSLocalizedDescriptionKey: "Youth profile must have an ID"])
        }
        try db.collection("youth_profiles").document(id).setData(from: profile, merge: true)
    }
    
    func deleteYouthProfile(id: String) async throws {
        try await db.collection("youth_profiles").document(id).delete()
    }
    
    // Fetch youth profiles for a specific foster parent
    func fetchYouthProfilesForFosterParent(fosterParentId: String, completion: @escaping ([YouthProfile]?, Error?) -> Void) {
        db.collection("youth_profiles")
            .whereField("foster_parent_id", isEqualTo: fosterParentId)
            .getDocuments { snapshot, error in
                if let error = error {
                    completion(nil, error)
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    completion([], nil)
                    return
                }
                
                let profiles = documents.compactMap { document -> YouthProfile? in
                    try? document.data(as: YouthProfile.self)
                }
                
                completion(profiles, nil)
            }
    }
    
    // MARK: - Theme Settings
    
    func saveThemeSettings(userId: String, settings: [String: Any], completion: @escaping (Error?) -> Void) {
        db.collection("themes").document(userId).setData(settings, merge: true) { error in
            completion(error)
        }
    }
    
    func fetchThemeSettings(userId: String, completion: @escaping ([String: Any]?, Error?) -> Void) {
        db.collection("themes").document(userId).getDocument { document, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            completion(document?.data(), nil)
        }
    }
    
    func saveThemeSettings(userId: String, settings: ThemeSettings) async throws {
        try db.collection("themes").document(userId).setData(from: settings, merge: true)
    }
    
    func fetchThemeSettings(userId: String) async throws -> ThemeSettings? {
        let document = try await db.collection("themes").document(userId).getDocument()
        return try document.data(as: ThemeSettings.self)
    }
    
    // MARK: - Medication Logs
    
    func fetchMedicationLogs(for youthId: String) async throws -> [MedicationLog] {
        let snapshot = try await db.collection("medication_logs")
            .whereField("youth_id", isEqualTo: youthId)
            .order(by: "administered_at", descending: true)
            .getDocuments()
        
        return snapshot.documents.compactMap { document in
            try? document.data(as: MedicationLog.self)
        }
    }
    
    func createMedicationLog(_ log: MedicationLog) async throws -> String {
        let docRef = try db.collection("medication_logs").addDocument(from: log)
        return docRef.documentID
    }
    
    func updateMedicationLog(_ log: MedicationLog) async throws {
        guard let id = log.id else {
            throw NSError(domain: "FirestoreService", code: 400, userInfo: [NSLocalizedDescriptionKey: "Medication log must have an ID"])
        }
        try db.collection("medication_logs").document(id).setData(from: log, merge: true)
    }
    
    func deleteMedicationLog(id: String) async throws {
        try await db.collection("medication_logs").document(id).delete()
    }
    
    // Legacy method for backward compatibility
    func addMedicationLog(youthId: String, medication: String, dosage: String, notes: String?, completion: @escaping (Error?) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(NSError(domain: "FirestoreService", code: 401, userInfo: [NSLocalizedDescriptionKey: "User not authenticated"]))
            return
        }
        
        let medicationLog = MedicationLog(
            youthId: youthId,
            medicationName: medication,
            dosage: dosage,
            frequency: "As needed", // Default value
            administeredBy: currentUser.uid,
            administeredAt: Date(),
            notes: notes,
            createdAt: Date()
        )
        
        Task {
            do {
                _ = try await createMedicationLog(medicationLog)
                completion(nil)
            } catch {
                completion(error)
            }
        }
    }
    
    // MARK: - Activity Logs
    
    func fetchActivityLogs(for youthId: String, limit: Int = 50) async throws -> [ActivityLog] {
        let snapshot = try await db.collection("activity_logs")
            .whereField("youth_id", isEqualTo: youthId)
            .order(by: "performed_at", descending: true)
            .limit(to: limit)
            .getDocuments()
        
        return snapshot.documents.compactMap { document in
            try? document.data(as: ActivityLog.self)
        }
    }
    
    func createActivityLog(_ log: ActivityLog) async throws -> String {
        let docRef = try db.collection("activity_logs").addDocument(from: log)
        return docRef.documentID
    }
    
    // MARK: - Real-time Listeners
    
    func listenToYouthProfiles(completion: @escaping (Result<[YouthProfile], Error>) -> Void) -> ListenerRegistration {
        return db.collection("youth_profiles").addSnapshotListener { snapshot, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let documents = snapshot?.documents else {
                completion(.success([]))
                return
            }
            
            let youthProfiles = documents.compactMap { document in
                try? document.data(as: YouthProfile.self)
            }
            
            completion(.success(youthProfiles))
        }
    }
    
    func listenToMedicationLogs(for youthId: String, completion: @escaping (Result<[MedicationLog], Error>) -> Void) -> ListenerRegistration {
        return db.collection("medication_logs")
            .whereField("youth_id", isEqualTo: youthId)
            .order(by: "administered_at", descending: true)
            .addSnapshotListener { snapshot, error in
                if let error = error {
                    completion(.failure(error))
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    completion(.success([]))
                    return
                }
                
                let logs = documents.compactMap { document in
                    try? document.data(as: MedicationLog.self)
                }
                
                completion(.success(logs))
            }
    }
}