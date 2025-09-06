import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';
import '../../services/supabase_service.dart';
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
    final supabaseService = context.read<SupabaseService>();

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
        data = await supabaseService.getAdminDashboardData();
      } else if (userRole == 'worker') {
        // Worker dashboard data
        data = await supabaseService.getWorkerDashboardData(userId);
      } else if (userRole == 'foster_parent') {
        // Foster parent dashboard data
        data = await supabaseService.getFosterParentDashboardData(userId);
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
                    Text(
                      'Welcome back!',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 24),
                    _buildDashboardGrid(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildDashboardGrid() {
    final authProvider = context.read<AuthProvider>();
    final userRole = authProvider.userRole;

    if (userRole == 'admin') {
      return GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        children: [
          DashboardCard(
            title: 'Total Users',
            value: _dashboardData['users']?.toString() ?? '0',
            icon: Icons.people,
            onTap: () => context.go('/users'),
          ),
          DashboardCard(
            title: 'Youth in Care',
            value: _dashboardData['youth']?.toString() ?? '0',
            icon: Icons.child_care,
            onTap: () => context.go('/youth'),
          ),
          DashboardCard(
            title: 'Foster Parents',
            value: _dashboardData['fosterParents']?.toString() ?? '0',
            icon: Icons.family_restroom,
            onTap: () => context.go('/foster-parents'),
          ),
          DashboardCard(
            title: 'Reports',
            value: _dashboardData['reports']?.toString() ?? '0',
            icon: Icons.report,
            onTap: () => context.go('/reports'),
          ),
        ],
      );
    } else if (userRole == 'worker') {
      return GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        children: [
          DashboardCard(
            title: 'Assigned Youth',
            value: _dashboardData['assignedYouth']?.toString() ?? '0',
            icon: Icons.assignment_ind,
            onTap: () => context.go('/assigned-youth'),
          ),
          DashboardCard(
            title: 'Foster Parents',
            value: _dashboardData['fosterParents']?.toString() ?? '0',
            icon: Icons.family_restroom,
            onTap: () => context.go('/foster-parents'),
          ),
        ],
      );
    } else if (userRole == 'foster_parent') {
      return GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        children: [
          DashboardCard(
            title: 'Youth in Care',
            value: _dashboardData['youthInCare']?.toString() ?? '0',
            icon: Icons.child_care,
            onTap: () => context.go('/youth-in-care'),
          ),
          DashboardCard(
            title: 'Medication Logs',
            value: _dashboardData['medicationLogs']?.toString() ?? '0',
            icon: Icons.medical_services,
            onTap: () => context.go('/medication-logs'),
          ),
        ],
      );
    }

    return const SizedBox.shrink();
  }

  void _handleLogout() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.signOut();
    if (mounted) {
      context.go('/login');
    }
  }
}
