import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../providers/auth_provider.dart';
import '../../services/firestore_service.dart';
import '../../models/youth_model.dart';
import '../../widgets/app_drawer.dart';

class YouthProfilesScreen extends StatefulWidget {
  final bool showOnlyAssigned;
  
  const YouthProfilesScreen({
    super.key,
    this.showOnlyAssigned = false,
  });

  @override
  State<YouthProfilesScreen> createState() => _YouthProfilesScreenState();
}

class _YouthProfilesScreenState extends State<YouthProfilesScreen> {
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.showOnlyAssigned ? 'My Youth' : 'Youth Profiles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: _showSearchDialog,
          ),
          if (!widget.showOnlyAssigned)
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                // TODO: Navigate to add youth screen
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Add Youth - Coming Soon')),
                );
              },
            ),
        ],
      ),
      drawer: const AppDrawer(),
      body: Column(
        children: [
          // Search bar
          if (_searchQuery.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Searching for: "$_searchQuery"',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      setState(() {
                        _searchQuery = '';
                      });
                      _searchController.clear();
                    },
                  ),
                ],
              ),
            ),
          
          // Youth list
          Expanded(
            child: _buildYouthList(),
          ),
        ],
      ),
    );
  }

  Widget _buildYouthList() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final firestoreService = context.read<FirestoreService>();
        
        Stream<QuerySnapshot> stream;
        
        if (widget.showOnlyAssigned && authProvider.userRole == 'foster_parent') {
          // Show only youth assigned to this foster parent
          stream = firestoreService.getYouthByFosterParent(authProvider.currentUser!.uid);
        } else if (authProvider.userRole == 'worker') {
          // Show only youth assigned to this worker
          stream = firestoreService.getYouthByWorker(authProvider.currentUser!.uid);
        } else {
          // Show all youth profiles (admin or general view)
          stream = firestoreService.getYouthProfiles();
        }
        
        return StreamBuilder<QuerySnapshot>(
          stream: stream,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 64, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading youth profiles',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {}); // Trigger rebuild
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            final docs = snapshot.data?.docs ?? [];
            
            if (docs.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.child_care, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(
                      widget.showOnlyAssigned 
                          ? 'No youth assigned to you'
                          : 'No youth profiles found',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.showOnlyAssigned
                          ? 'Youth will appear here when assigned to your care'
                          : 'Youth profiles will appear here when added',
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            }

            // Filter youth based on search query
            List<YouthModel> youthList = docs
                .map((doc) => YouthModel.fromMap(doc.data() as Map<String, dynamic>, doc.id))
                .where((youth) {
                  if (_searchQuery.isEmpty) return true;
                  final query = _searchQuery.toLowerCase();
                  return youth.fullName.toLowerCase().contains(query) ||
                         youth.caseNumber?.toLowerCase().contains(query) == true;
                })
                .toList();

            if (youthList.isEmpty && _searchQuery.isNotEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.search_off, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(
                      'No results found',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Try adjusting your search terms',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: youthList.length,
              itemBuilder: (context, index) {
                final youth = youthList[index];
                return _buildYouthCard(youth);
              },
            );
          },
        );
      },
    );
  }

  Widget _buildYouthCard(YouthModel youth) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: Theme.of(context).colorScheme.primary,
          child: Text(
            youth.firstName.isNotEmpty ? youth.firstName[0].toUpperCase() : 'Y',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          youth.fullName,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (youth.age != null)
              Text('Age: ${youth.age}'),
            if (youth.caseNumber != null)
              Text('Case: ${youth.caseNumber}'),
            if (youth.status != null)
              Container(
                margin: const EdgeInsets.only(top: 4),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: youth.isActive ? Colors.green : Colors.orange,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  youth.status!.toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () => context.go('/youth/${youth.id}'),
      ),
    );
  }

  void _showSearchDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Search Youth'),
        content: TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            hintText: 'Enter name or case number',
            prefixIcon: Icon(Icons.search),
          ),
          autofocus: true,
          onSubmitted: (value) {
            setState(() {
              _searchQuery = value.trim();
            });
            Navigator.pop(context);
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _searchQuery = _searchController.text.trim();
              });
              Navigator.pop(context);
            },
            child: const Text('Search'),
          ),
        ],
      ),
    );
  }
}