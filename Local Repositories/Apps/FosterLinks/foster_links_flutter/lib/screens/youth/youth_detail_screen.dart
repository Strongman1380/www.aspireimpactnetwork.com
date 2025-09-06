import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import '../../services/firestore_service.dart';
import '../../models/youth_model.dart';
import '../../providers/auth_provider.dart';

class YouthDetailScreen extends StatelessWidget {
  final String youthId;
  
  const YouthDetailScreen({
    super.key,
    required this.youthId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<DocumentSnapshot>(
        stream: context.read<FirestoreService>().getYouthById(youthId),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Scaffold(
              appBar: AppBar(title: const Text('Error')),
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 64, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading youth profile',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Scaffold(
              appBar: AppBar(title: const Text('Loading...')),
              body: const Center(child: CircularProgressIndicator()),
            );
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return Scaffold(
              appBar: AppBar(title: const Text('Not Found')),
              body: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.person_off, size: 64, color: Colors.grey),
                    SizedBox(height: 16),
                    Text('Youth profile not found'),
                  ],
                ),
              ),
            );
          }

          final youth = YouthModel.fromMap(
            snapshot.data!.data() as Map<String, dynamic>,
            snapshot.data!.id,
          );

          return _buildYouthDetail(context, youth);
        },
      ),
    );
  }

  Widget _buildYouthDetail(BuildContext context, YouthModel youth) {
    return Scaffold(
      appBar: AppBar(
        title: Text(youth.fullName),
        actions: [
          Consumer<AuthProvider>(
            builder: (context, authProvider, child) {
              // Only show edit button for admin and workers
              if (authProvider.userRole == 'admin' || authProvider.userRole == 'worker') {
                return IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {
                    // TODO: Navigate to edit youth screen
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Edit Youth - Coming Soon')),
                    );
                  },
                );
              }
              return const SizedBox.shrink();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile header
            _buildProfileHeader(context, youth),
            
            const SizedBox(height: 24),
            
            // Basic information
            _buildBasicInfo(context, youth),
            
            const SizedBox(height: 16),
            
            // Medical information
            _buildMedicalInfo(context, youth),
            
            const SizedBox(height: 16),
            
            // Contact information
            _buildContactInfo(context, youth),
            
            const SizedBox(height: 16),
            
            // Placement information
            _buildPlacementInfo(context, youth),
            
            const SizedBox(height: 16),
            
            // Medications
            _buildMedications(context, youth),
            
            const SizedBox(height: 24),
            
            // Action buttons
            _buildActionButtons(context, youth),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context, YouthModel youth) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: Theme.of(context).colorScheme.primary,
              child: Text(
                youth.firstName.isNotEmpty ? youth.firstName[0].toUpperCase() : 'Y',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    youth.fullName,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (youth.age != null)
                    Text(
                      '${youth.age} years old',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  if (youth.caseNumber != null)
                    Text(
                      'Case: ${youth.caseNumber}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  if (youth.status != null)
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: youth.isActive ? Colors.green : Colors.orange,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        youth.status!.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBasicInfo(BuildContext context, YouthModel youth) {
    return _buildInfoCard(
      context,
      'Basic Information',
      Icons.person,
      [
        if (youth.dateOfBirth != null)
          _buildInfoRow('Date of Birth', DateFormat('MMM dd, yyyy').format(youth.dateOfBirth!)),
        if (youth.gender != null)
          _buildInfoRow('Gender', youth.gender!),
        if (youth.placementDate != null)
          _buildInfoRow('Placement Date', youth.placementDate!),
      ],
    );
  }

  Widget _buildMedicalInfo(BuildContext context, YouthModel youth) {
    return _buildInfoCard(
      context,
      'Medical Information',
      Icons.medical_services,
      [
        if (youth.medicalInfo != null)
          _buildInfoRow('Medical Info', youth.medicalInfo!),
        if (youth.allergies != null)
          _buildInfoRow('Allergies', youth.allergies!),
      ],
    );
  }

  Widget _buildContactInfo(BuildContext context, YouthModel youth) {
    return _buildInfoCard(
      context,
      'Emergency Contact',
      Icons.contact_phone,
      [
        if (youth.emergencyContact != null)
          _buildInfoRow('Contact Name', youth.emergencyContact!),
        if (youth.emergencyPhone != null)
          _buildInfoRow('Phone Number', youth.emergencyPhone!),
      ],
    );
  }

  Widget _buildPlacementInfo(BuildContext context, YouthModel youth) {
    return _buildInfoCard(
      context,
      'Placement Information',
      Icons.home,
      [
        if (youth.schoolInfo != null)
          _buildInfoRow('School', youth.schoolInfo!),
        // TODO: Add foster parent name lookup
        if (youth.fosterParentId != null)
          _buildInfoRow('Foster Parent ID', youth.fosterParentId!),
        if (youth.fosterWorker != null)
          _buildInfoRow('Social Worker ID', youth.fosterWorker!),
      ],
    );
  }

  Widget _buildMedications(BuildContext context, YouthModel youth) {
    if (youth.medications == null || youth.medications!.isEmpty) {
      return _buildInfoCard(
        context,
        'Medications',
        Icons.medication,
        [
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text('No medications listed'),
          ),
        ],
      );
    }

    return _buildInfoCard(
      context,
      'Medications',
      Icons.medication,
      youth.medications!.map((medication) => 
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            children: [
              const Icon(Icons.circle, size: 8),
              const SizedBox(width: 8),
              Expanded(child: Text(medication)),
            ],
          ),
        ),
      ).toList(),
    );
  }

  Widget _buildInfoCard(BuildContext context, String title, IconData icon, List<Widget> children) {
    if (children.isEmpty) return const SizedBox.shrink();
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, YouthModel youth) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Medication log button (for foster parents)
            if (authProvider.userRole == 'foster_parent')
              ElevatedButton.icon(
                onPressed: () {
                  // TODO: Navigate to medication log screen
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Medication Log - Coming Soon')),
                  );
                },
                icon: const Icon(Icons.medication),
                label: const Text('Log Medication'),
              ),
            
            const SizedBox(height: 8),
            
            // View medication history
            OutlinedButton.icon(
              onPressed: () {
                // TODO: Navigate to medication history screen
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Medication History - Coming Soon')),
                );
              },
              icon: const Icon(Icons.history),
              label: const Text('View Medication History'),
            ),
          ],
        );
      },
    );
  }
}