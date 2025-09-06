import Foundation
import FirebaseFirestoreSwift

// MARK: - Youth Profile Model
struct YouthProfile: Identifiable, Codable {
    @DocumentID var id: String?
    var firstName: String
    var lastName: String
    var dateOfBirth: Date
    var gender: String
    var caseNumber: String?
    var fosterParentId: String?
    var notes: String?
    var createdAt: Date?
    var updatedAt: Date?
    
    // Computed properties
    var fullName: String {
        return "\(firstName) \(lastName)"
    }
    
    var age: Int {
        let calendar = Calendar.current
        let now = Date()
        let ageComponents = calendar.dateComponents([.year], from: dateOfBirth, to: now)
        return ageComponents.year ?? 0
    }
    
    // Custom coding keys to match Firestore field names
    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case dateOfBirth = "dob"
        case gender
        case caseNumber = "case_number"
        case fosterParentId = "foster_parent_id"
        case notes
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - User Model
struct UserProfile: Identifiable, Codable {
    @DocumentID var id: String?
    var email: String
    var role: UserRole
    var firstName: String?
    var lastName: String?
    var agencyId: String?
    var createdAt: Date?
    var updatedAt: Date?
    
    var fullName: String {
        guard let firstName = firstName, let lastName = lastName else {
            return email
        }
        return "\(firstName) \(lastName)"
    }
    
    enum CodingKeys: String, CodingKey {
        case id
        case email
        case role
        case firstName = "first_name"
        case lastName = "last_name"
        case agencyId = "agency_id"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - User Role Enum
enum UserRole: String, Codable, CaseIterable {
    case admin = "admin"
    case worker = "worker"
    case fosterParent = "foster_parent"
    
    var displayName: String {
        switch self {
        case .admin:
            return "Administrator"
        case .worker:
            return "Case Worker"
        case .fosterParent:
            return "Foster Parent"
        }
    }
}

// MARK: - Theme Settings Model
struct ThemeSettings: Codable {
    var mode: ThemeMode
    var primaryColor: String
    var secondaryColor: String
    var logoUrl: String?
    var logoName: String?
    var updatedAt: Date?
    
    enum CodingKeys: String, CodingKey {
        case mode
        case primaryColor = "primaryColor"
        case secondaryColor = "secondaryColor"
        case logoUrl = "logoUrl"
        case logoName = "logoName"
        case updatedAt = "updated_at"
    }
}

enum ThemeMode: String, Codable, CaseIterable {
    case light = "light"
    case dark = "dark"
    case system = "system"
    
    var displayName: String {
        switch self {
        case .light:
            return "Light"
        case .dark:
            return "Dark"
        case .system:
            return "System"
        }
    }
}

// MARK: - Medication Log Model
struct MedicationLog: Identifiable, Codable {
    @DocumentID var id: String?
    var youthId: String
    var medicationName: String
    var dosage: String
    var frequency: String
    var administeredBy: String
    var administeredAt: Date
    var notes: String?
    var createdAt: Date?
    
    enum CodingKeys: String, CodingKey {
        case id
        case youthId = "youth_id"
        case medicationName = "medication_name"
        case dosage
        case frequency
        case administeredBy = "administered_by"
        case administeredAt = "administered_at"
        case notes
        case createdAt = "created_at"
    }
}

// MARK: - Activity Log Model
struct ActivityLog: Identifiable, Codable {
    @DocumentID var id: String?
    var youthId: String
    var activityType: ActivityType
    var description: String
    var performedBy: String
    var performedAt: Date
    var metadata: [String: String]?
    
    enum CodingKeys: String, CodingKey {
        case id
        case youthId = "youth_id"
        case activityType = "activity_type"
        case description
        case performedBy = "performed_by"
        case performedAt = "performed_at"
        case metadata
    }
}

enum ActivityType: String, Codable, CaseIterable {
    case medicationAdministered = "medication_administered"
    case appointmentScheduled = "appointment_scheduled"
    case noteAdded = "note_added"
    case profileUpdated = "profile_updated"
    case documentUploaded = "document_uploaded"
    
    var displayName: String {
        switch self {
        case .medicationAdministered:
            return "Medication Administered"
        case .appointmentScheduled:
            return "Appointment Scheduled"
        case .noteAdded:
            return "Note Added"
        case .profileUpdated:
            return "Profile Updated"
        case .documentUploaded:
            return "Document Uploaded"
        }
    }
}