import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../services/firestore_service.dart';
import '../../widgets/dashboard_card.dart';
import '../../widgets/app_drawer.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, int> _dashboardData = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    final authProvider = context.read<AuthProvider>();
    final firestoreService = context.read<FirestoreService>();
    
    if (authProvider.currentUser == null || authProvider.userRole == null) {
      setState(() {
        _loading = false;
      });
      return;
    }

    try {
      final userRole = authProvider.userRole!;
      final userId = authProvider.currentUser!.uid;
      
      Map<String, int> data = {};
      
      if (userRole == 'admin') {
        // Admin dashboard data
        final results = await Future.wait([
          firestoreService.getUserCount(),
          firestoreService.getYouthCount(),
          firestoreService.getFosterParentCount(),
          firestoreService.getReportsCount(),
        ]);
        
        data = {
          'users': results[0],
          'youth': results[1],
          'fosterParents': results[2],
          'reports': results[3],
        };
      } else if (userRole == 'worker') {
        // Worker dashboard data
        final results = await Future.wait([
          firestoreService.getAssignedYouthCount(userId),
          firestoreService.getFosterParentCount(),
        ]);
        
        data = {
          'assignedYouth': results[0],
          'fosterParents': results[1],
        };
      } else if (userRole == 'foster_parent') {
        // Foster parent dashboard data
        final results = await Future.wait([
          firestoreService.getYouthInCareCount(userId),
          firestoreService.getMedicationLogCount(userId),
        ]);
        
        data = {
          'youthInCare': results[0],
          'medicationLogs': results[1],
        };
      }
      
      setState(() {
        _dashboardData = data;
        _loading = false;
      });
    } catch (e) {
  // TODO: Consider logging to a service or showing a snackbar in UIProvider
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _loading = true;
              });
              _loadDashboardData();
            },
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              switch (value) {
                case 'settings':
                  context.go('/settings');
                  break;
                case 'logout':
                  _handleLogout();
                  break;
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'settings',
                child: ListTile(
                  leading: Icon(Icons.settings),
                  title: Text('Settings'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: ListTile(
                  leading: Icon(Icons.logout),
                  title: Text('Logout'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ],
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDashboardData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome message
                    _buildWelcomeMessage(),
                    
                    const SizedBox(height: 24),
                    
                    // Dashboard cards
                    _buildDashboardCards(),
                    
                    const SizedBox(height: 24),
                    
                    // Recent activity section
                    _buildRecentActivity(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildWelcomeMessage() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final userName = authProvider.userModel?.fullName ?? 'User';
        final userRole = authProvider.userRole ?? '';
        
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  child: Text(
                    userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimary,
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
                        'Welcome back, $userName',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        _getRoleDisplayName(userRole),
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDashboardCards() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        final userRole = authProvider.userRole;
        
        switch (userRole) {
          case 'admin':
            return _buildAdminCards();
          case 'worker':
            return _buildWorkerCards();
          case 'foster_parent':
            return _buildFosterParentCards();
          default:
            return const SizedBox.shrink();
        }
      },
    );
  }

  Widget _buildAdminCards() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: [
        DashboardCard(
          title: 'Users',
          value: _dashboardData['users']?.toString() ?? '...',
          icon: Icons.people,
          onTap: () => context.go('/user-management'),
        ),
        DashboardCard(
          title: 'Youth',
          value: _dashboardData['youth']?.toString() ?? '...',
          icon: Icons.child_care,
          onTap: () => context.go('/youth-profiles'),
        ),
        DashboardCard(
          title: 'Foster Parents',
          value: _dashboardData['fosterParents']?.toString() ?? '...',
          icon: Icons.family_restroom,
          onTap: () => context.go('/foster-parents'),
        ),
        DashboardCard(
          title: 'Reports',
          value: _dashboardData['reports']?.toString() ?? '...',
          icon: Icons.assessment,
          onTap: () => context.go('/reports'),
        ),
      ],
    );
  }

  Widget _buildWorkerCards() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: [
        DashboardCard(
          title: 'Assigned Youth',
          value: _dashboardData['assignedYouth']?.toString() ?? '...',
          icon: Icons.child_care,
          onTap: () => context.go('/youth-profiles'),
        ),
        DashboardCard(
          title: 'Foster Parents',
          value: _dashboardData['fosterParents']?.toString() ?? '...',
          icon: Icons.family_restroom,
          onTap: () => context.go('/foster-parents'),
        ),
      ],
    );
  }

  Widget _buildFosterParentCards() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: [
        DashboardCard(
          title: 'Youth in Care',
          value: _dashboardData['youthInCare']?.toString() ?? '...',
          icon: Icons.child_care,
          onTap: () => context.go('/my-youth'),
        ),
        DashboardCard(
          title: 'Medication Logs',
          value: _dashboardData['medicationLogs']?.toString() ?? '...',
          icon: Icons.medication,
          onTap: () => context.go('/medication-logs'),
        ),
      ],
    );
  }

  Widget _buildRecentActivity() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            // TODO: Implement recent activity stream
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Text('No recent activity'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getRoleDisplayName(String role) {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'worker':
        return 'Social Worker';
      case 'foster_parent':
        return 'Foster Parent';
      default:
        return 'User';
    }
  }

  Future<void> _handleLogout() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.signOut();
    if (mounted) {
      context.go('/auth/login');
    }
  }
}