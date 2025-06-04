import FirebaseFirestore
import FirebaseAuth

class FirestoreService {
    static let shared = FirestoreService()
    
    private let db = Firestore.firestore()
    
    private init() {}
    
    // Fetch user role from Firestore
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
            
            let data = document.data()
            let role = data?["role"] as? String
            completion(role, nil)
        }
    }
    
    // Fetch youth profiles
    func fetchYouthProfiles(completion: @escaping ([YouthProfile]?, Error?) -> Void) {
        db.collection("youth_profiles").getDocuments { snapshot, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let documents = snapshot?.documents else {
                completion([], nil)
                return
            }
            
            let profiles = documents.compactMap { document -> YouthProfile? in
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
            
            completion(profiles, nil)
        }
    }
    
    // Fetch youth profiles for a specific foster parent
    func fetchYouthProfilesForFosterParent(fosterParentId: String, completion: @escaping ([YouthProfile]?, Error?) -> Void) {
        db.collection("youth_profiles")
            .whereField("fosterParentId", isEqualTo: fosterParentId)
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
                
                completion(profiles, nil)
            }
    }
    
    // Add a medication log
    func addMedicationLog(youthId: String, medication: String, dosage: String, notes: String?, completion: @escaping (Error?) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(NSError(domain: "FirestoreService", code: 401, userInfo: [NSLocalizedDescriptionKey: "User not authenticated"]))
            return
        }
        
        let data: [String: Any] = [
            "youthId": youthId,
            "medication": medication,
            "dosage": dosage,
            "notes": notes ?? "",
            "timestamp": FieldValue.serverTimestamp(),
            "adminBy": currentUser.uid
        ]
        
        db.collection("medication_logs").addDocument(data: data) { error in
            completion(error)
        }
    }
}