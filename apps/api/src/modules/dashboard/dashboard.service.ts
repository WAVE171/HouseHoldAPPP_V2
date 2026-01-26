import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(householdId: string) {
    const [
      totalTasks,
      pendingTasks,
      completedTasks,
      totalInventoryItems,
      lowStockItems,
      upcomingEvents,
      totalTransactions,
      monthlyExpenses,
      totalBudgets,
      totalVehicles,
      totalPets,
      totalEmployees,
      totalRecipes,
    ] = await Promise.all([
      // Tasks stats
      this.prisma.task.count({ where: { householdId } }),
      this.prisma.task.count({ where: { householdId, status: 'PENDING' } }),
      this.prisma.task.count({ where: { householdId, status: 'COMPLETED' } }),

      // Inventory stats
      this.prisma.inventoryItem.count({ where: { householdId } }),
      this.prisma.inventoryItem.count({
        where: {
          householdId,
          lowStockThreshold: { not: null },
          quantity: { lte: this.prisma.inventoryItem.fields.lowStockThreshold },
        },
      }).catch(() => 0), // Handle case where comparison fails

      // Events stats (upcoming in next 7 days)
      this.prisma.event.count({
        where: {
          householdId,
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Finance stats
      this.prisma.transaction.count({ where: { householdId } }),
      this.prisma.transaction.aggregate({
        where: {
          householdId,
          type: 'EXPENSE',
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),

      this.prisma.budget.count({ where: { householdId } }),

      // Other counts
      this.prisma.vehicle.count({ where: { householdId } }),
      this.prisma.pet.count({ where: { householdId } }),
      this.prisma.employee.count({ where: { householdId } }),
      this.prisma.recipe.count({ where: { householdId } }),
    ]);

    return {
      tasks: {
        total: totalTasks,
        pending: pendingTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      inventory: {
        total: totalInventoryItems,
        lowStock: lowStockItems,
      },
      calendar: {
        upcomingEvents,
      },
      finance: {
        totalTransactions,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        totalBudgets,
      },
      vehicles: totalVehicles,
      pets: totalPets,
      employees: totalEmployees,
      recipes: totalRecipes,
    };
  }

  async getRecentActivity(householdId: string, limit = 20) {
    const [recentTasks, recentTransactions, recentEvents] = await Promise.all([
      this.prisma.task.findMany({
        where: { householdId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          creator: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      this.prisma.transaction.findMany({
        where: { householdId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          category: true,
          description: true,
          createdAt: true,
        },
      }),
      this.prisma.event.findMany({
        where: { householdId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          startDate: true,
          category: true,
          createdAt: true,
        },
      }),
    ]);

    // Combine and sort activities
    const activities = [
      ...recentTasks.map((task) => ({
        type: 'task' as const,
        id: task.id,
        title: task.title,
        description: `Task ${task.status.toLowerCase()}`,
        timestamp: task.updatedAt.toISOString(),
        user: task.creator?.profile
          ? `${task.creator.profile.firstName} ${task.creator.profile.lastName}`
          : undefined,
      })),
      ...recentTransactions.map((txn) => ({
        type: 'transaction' as const,
        id: txn.id,
        title: `${txn.type === 'INCOME' ? '+' : '-'}$${txn.amount.toFixed(2)}`,
        description: txn.description || txn.category,
        timestamp: txn.createdAt.toISOString(),
      })),
      ...recentEvents.map((event) => ({
        type: 'event' as const,
        id: event.id,
        title: event.title,
        description: `Event on ${event.startDate.toLocaleDateString()}`,
        timestamp: event.createdAt.toISOString(),
      })),
    ];

    // Sort by timestamp
    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return activities.slice(0, limit);
  }

  async getUpcomingTasks(householdId: string, days = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const tasks = await this.prisma.task.findMany({
      where: {
        householdId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: {
          gte: new Date(),
          lte: endDate,
        },
      },
      orderBy: { dueDate: 'asc' },
      include: {
        assignee: {
          select: {
            profile: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.toISOString(),
      priority: task.priority,
      status: task.status,
      assignee: task.assignee?.profile
        ? `${task.assignee.profile.firstName} ${task.assignee.profile.lastName}`
        : null,
    }));
  }

  async getUpcomingEvents(householdId: string, days = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const events = await this.prisma.event.findMany({
      where: {
        householdId,
        startDate: {
          gte: new Date(),
          lte: endDate,
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      category: event.category,
      allDay: event.allDay,
    }));
  }

  async getExpiringItems(householdId: string, days = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const items = await this.prisma.inventoryItem.findMany({
      where: {
        householdId,
        expiryDate: {
          gte: new Date(),
          lte: endDate,
        },
      },
      orderBy: { expiryDate: 'asc' },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate?.toISOString(),
      category: item.category.name,
      daysUntilExpiry: item.expiryDate
        ? Math.ceil(
            (item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          )
        : null,
    }));
  }

  async getFinanceSummary(householdId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [income, expenses, budgets] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          householdId,
          type: 'INCOME',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          householdId,
          type: 'EXPENSE',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.budget.findMany({
        where: {
          householdId,
          startDate: { lte: endOfMonth },
          endDate: { gte: startOfMonth },
        },
        include: {
          categories: true,
        },
      }),
    ]);

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.totalBudgeted, 0);
    const totalExpenses = expenses._sum.amount || 0;

    return {
      income: income._sum.amount || 0,
      expenses: totalExpenses,
      net: (income._sum.amount || 0) - totalExpenses,
      budgetTotal: totalBudgeted,
      budgetRemaining: totalBudgeted - totalExpenses,
      budgetUsedPercent:
        totalBudgeted > 0 ? Math.round((totalExpenses / totalBudgeted) * 100) : 0,
    };
  }
}
