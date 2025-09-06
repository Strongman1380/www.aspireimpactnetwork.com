import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  // Get youth profiles
  Stream<QuerySnapshot> getYouthProfiles() {
    return _firestore.collection('youth_profiles').snapshots();
  }
  
  // Get youth profile by ID
  Stream<DocumentSnapshot> getYouthById(String id) {
    return _firestore.collection('youth_profiles').doc(id).snapshots();
  }
  
  // Get youth profiles for a specific foster parent
  Stream<QuerySnapshot> getYouthByFosterParent(String fosterParentId) {
    return _firestore
        .collection('youth_profiles')
        .where('fosterParentId', isEqualTo: fosterParentId)
        .snapshots();
  }
  
  // Get youth profiles assigned to a worker
  Stream<QuerySnapshot> getYouthByWorker(String workerId) {
    return _firestore
        .collection('youth_profiles')
        .where('foster_worker', isEqualTo: workerId)
        .snapshots();
  }
  
  // Add medication log
  Future<void> addMedicationLog(String youthId, Map<String, dynamic> medicationData) {
    return _firestore.collection('medication_logs').add({
      'youthId': youthId,
      'timestamp': FieldValue.serverTimestamp(),
      ...medicationData,
    });
  }
  
  // Get medication logs for a youth
  Stream<QuerySnapshot> getMedicationLogs(String youthId) {
    return _firestore
        .collection('medication_logs')
        .where('youthId', isEqualTo: youthId)
        .orderBy('timestamp', descending: true)
        .snapshots();
  }
  
  // Get medication logs for a foster parent
  Stream<QuerySnapshot> getMedicationLogsByFosterParent(String fosterParentId) {
    return _firestore
        .collection('medication_logs')
        .where('fosterParentId', isEqualTo: fosterParentId)
        .orderBy('timestamp', descending: true)
        .snapshots();
  }
  
  // Get user count (admin only)
  Future<int> getUserCount() async {
    final snapshot = await _firestore.collection('users').get();
    return snapshot.docs.length;
  }
  
  // Get youth count
  Future<int> getYouthCount() async {
    final snapshot = await _firestore.collection('youth_profiles').get();
    return snapshot.docs.length;
  }
  
  // Get foster parent count
  Future<int> getFosterParentCount() async {
    final snapshot = await _firestore
        .collection('users')
        .where('role', isEqualTo: 'foster_parent')
        .get();
    return snapshot.docs.length;
  }
  
  // Get reports count
  Future<int> getReportsCount() async {
    final snapshot = await _firestore.collection('reports').get();
    return snapshot.docs.length;
  }
  
  // Get assigned youth count for a worker
  Future<int> getAssignedYouthCount(String workerId) async {
    final snapshot = await _firestore
        .collection('youth_profiles')
        .where('foster_worker', isEqualTo: workerId)
        .get();
    return snapshot.docs.length;
  }
  
  // Get youth in care count for a foster parent
  Future<int> getYouthInCareCount(String fosterParentId) async {
    final snapshot = await _firestore
        .collection('youth_profiles')
        .where('fosterParentId', isEqualTo: fosterParentId)
        .get();
    return snapshot.docs.length;
  }
  
  // Get medication log count for a foster parent
  Future<int> getMedicationLogCount(String fosterParentId) async {
    final snapshot = await _firestore
        .collection('medication_logs')
        .where('fosterParentId', isEqualTo: fosterParentId)
        .get();
    return snapshot.docs.length;
  }
  
  // Add youth profile
  Future<void> addYouthProfile(Map<String, dynamic> youthData) {
    return _firestore.collection('youth_profiles').add({
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
      ...youthData,
    });
  }
  
  // Update youth profile
  Future<void> updateYouthProfile(String youthId, Map<String, dynamic> youthData) {
    return _firestore.collection('youth_profiles').doc(youthId).update({
      'updatedAt': FieldValue.serverTimestamp(),
      ...youthData,
    });
  }
  
  // Delete youth profile
  Future<void> deleteYouthProfile(String youthId) {
    return _firestore.collection('youth_profiles').doc(youthId).delete();
  }
  
  // Get recent activity
  Stream<QuerySnapshot> getRecentActivity({int limit = 10}) {
    return _firestore
        .collection('activity_logs')
        .orderBy('timestamp', descending: true)
        .limit(limit)
        .snapshots();
  }
  
  // Add activity log
  Future<void> addActivityLog(Map<String, dynamic> activityData) {
    return _firestore.collection('activity_logs').add({
      'timestamp': FieldValue.serverTimestamp(),
      ...activityData,
    });
  }
}