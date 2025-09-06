class YouthModel {
  final String id;
  final String firstName;
  final String lastName;
  final DateTime? dateOfBirth;
  final String? gender;
  final String? fosterParentId;
  final String? fosterWorker;
  final String? medicalInfo;
  final String? allergies;
  final String? emergencyContact;
  final String? emergencyPhone;
  final String? schoolInfo;
  final String? caseNumber;
  final String? placementDate;
  final String? status;
  final List<String>? medications;
  final Map<String, dynamic>? customFields;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  YouthModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.dateOfBirth,
    this.gender,
    this.fosterParentId,
    this.fosterWorker,
    this.medicalInfo,
    this.allergies,
    this.emergencyContact,
    this.emergencyPhone,
    this.schoolInfo,
    this.caseNumber,
    this.placementDate,
    this.status,
    this.medications,
    this.customFields,
    this.createdAt,
    this.updatedAt,
  });

  factory YouthModel.fromMap(Map<String, dynamic> map, String id) {
    return YouthModel(
      id: id,
      firstName: map['firstName'] ?? '',
      lastName: map['lastName'] ?? '',
      dateOfBirth: map['dateOfBirth']?.toDate(),
      gender: map['gender'],
      fosterParentId: map['fosterParentId'],
      fosterWorker: map['fosterWorker'],
      medicalInfo: map['medicalInfo'],
      allergies: map['allergies'],
      emergencyContact: map['emergencyContact'],
      emergencyPhone: map['emergencyPhone'],
      schoolInfo: map['schoolInfo'],
      caseNumber: map['caseNumber'],
      placementDate: map['placementDate'],
      status: map['status'],
      medications: map['medications'] != null 
          ? List<String>.from(map['medications']) 
          : null,
      customFields: map['customFields'],
      createdAt: map['createdAt']?.toDate(),
      updatedAt: map['updatedAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'fosterParentId': fosterParentId,
      'fosterWorker': fosterWorker,
      'medicalInfo': medicalInfo,
      'allergies': allergies,
      'emergencyContact': emergencyContact,
      'emergencyPhone': emergencyPhone,
      'schoolInfo': schoolInfo,
      'caseNumber': caseNumber,
      'placementDate': placementDate,
      'status': status,
      'medications': medications,
      'customFields': customFields,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  String get fullName => '$firstName $lastName';

  int? get age {
    if (dateOfBirth == null) return null;
    final now = DateTime.now();
    int age = now.year - dateOfBirth!.year;
    if (now.month < dateOfBirth!.month || 
        (now.month == dateOfBirth!.month && now.day < dateOfBirth!.day)) {
      age--;
    }
    return age;
  }

  bool get isActive => status?.toLowerCase() == 'active';
}