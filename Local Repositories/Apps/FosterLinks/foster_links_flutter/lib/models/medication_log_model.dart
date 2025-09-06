class MedicationLogModel {
  final String id;
  final String youthId;
  final String medicationName;
  final String dosage;
  final DateTime administeredAt;
  final String administeredBy;
  final String? fosterParentId;
  final String? notes;
  final bool? missed;
  final String? reason;
  final DateTime? createdAt;

  MedicationLogModel({
    required this.id,
    required this.youthId,
    required this.medicationName,
    required this.dosage,
    required this.administeredAt,
    required this.administeredBy,
    this.fosterParentId,
    this.notes,
    this.missed,
    this.reason,
    this.createdAt,
  });

  factory MedicationLogModel.fromMap(Map<String, dynamic> map, String id) {
    return MedicationLogModel(
      id: id,
      youthId: map['youthId'] ?? '',
      medicationName: map['medicationName'] ?? '',
      dosage: map['dosage'] ?? '',
      administeredAt: map['administeredAt']?.toDate() ?? DateTime.now(),
      administeredBy: map['administeredBy'] ?? '',
      fosterParentId: map['fosterParentId'],
      notes: map['notes'],
      missed: map['missed'],
      reason: map['reason'],
      createdAt: map['createdAt']?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'youthId': youthId,
      'medicationName': medicationName,
      'dosage': dosage,
      'administeredAt': administeredAt,
      'administeredBy': administeredBy,
      'fosterParentId': fosterParentId,
      'notes': notes,
      'missed': missed,
      'reason': reason,
      'createdAt': createdAt,
    };
  }

  bool get wasMissed => missed == true;
  bool get wasAdministered => missed != true;
}