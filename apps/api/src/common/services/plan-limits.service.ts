import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    maxMembers: 3,
    maxTasks: 50,
    maxVehicles: 1,
    maxPets: 2,
    maxChildren: 3,
    maxEmployees: 0,
    maxInventoryItems: 100,
    features: {
      calendar: true,
      tasks: true,
      inventory: true,
      recipes: true,
      finance: false,
      scanning: false,
      employees: false,
      advancedReports: false,
    },
  },
  BASIC: {
    maxMembers: 10,
    maxTasks: 500,
    maxVehicles: 3,
    maxPets: 5,
    maxChildren: 10,
    maxEmployees: 2,
    maxInventoryItems: 1000,
    features: {
      calendar: true,
      tasks: true,
      inventory: true,
      recipes: true,
      finance: true,
      scanning: true,
      employees: true,
      advancedReports: false,
    },
  },
  PREMIUM: {
    maxMembers: -1, // unlimited
    maxTasks: -1,
    maxVehicles: -1,
    maxPets: -1,
    maxChildren: -1,
    maxEmployees: -1,
    maxInventoryItems: -1,
    features: {
      calendar: true,
      tasks: true,
      inventory: true,
      recipes: true,
      finance: true,
      scanning: true,
      employees: true,
      advancedReports: true,
    },
  },
  ENTERPRISE: {
    maxMembers: -1,
    maxTasks: -1,
    maxVehicles: -1,
    maxPets: -1,
    maxChildren: -1,
    maxEmployees: -1,
    maxInventoryItems: -1,
    features: {
      calendar: true,
      tasks: true,
      inventory: true,
      recipes: true,
      finance: true,
      scanning: true,
      employees: true,
      advancedReports: true,
      apiAccess: true,
      multipleHouseholds: true,
    },
  },
} as const;

export type PlanFeature = keyof typeof PLAN_LIMITS.FREE.features;

@Injectable()
export class PlanLimitsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the subscription for a household
   */
  async getHouseholdSubscription(householdId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { householdId },
    });

    // If no subscription exists, default to FREE plan
    if (!subscription) {
      return {
        plan: 'FREE' as SubscriptionPlan,
        status: 'ACTIVE' as SubscriptionStatus,
      };
    }

    return subscription;
  }

  /**
   * Get the plan limits for a household
   */
  async getPlanLimits(householdId: string) {
    const subscription = await this.getHouseholdSubscription(householdId);
    return PLAN_LIMITS[subscription.plan];
  }

  /**
   * Check if a feature is available for the household's plan
   */
  async hasFeature(householdId: string, feature: PlanFeature): Promise<boolean> {
    const subscription = await this.getHouseholdSubscription(householdId);
    const limits = PLAN_LIMITS[subscription.plan];
    return limits.features[feature] ?? false;
  }

  /**
   * Require a feature, throwing an error if not available
   */
  async requireFeature(householdId: string, feature: PlanFeature): Promise<void> {
    const hasAccess = await this.hasFeature(householdId, feature);
    if (!hasAccess) {
      throw new ForbiddenException(
        `This feature requires a higher subscription plan. Please upgrade to access ${feature}.`
      );
    }
  }

  /**
   * Check if a household can add more members
   */
  async canAddMember(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);
    if (limits.maxMembers === -1) return true;

    const currentCount = await this.prisma.userProfile.count({
      where: { householdId },
    });

    return currentCount < limits.maxMembers;
  }

  /**
   * Require the ability to add a member
   */
  async requireCanAddMember(householdId: string): Promise<void> {
    const canAdd = await this.canAddMember(householdId);
    if (!canAdd) {
      const limits = await this.getPlanLimits(householdId);
      throw new ForbiddenException(
        `You have reached the maximum number of members (${limits.maxMembers}) for your plan. Please upgrade to add more members.`
      );
    }
  }

  /**
   * Check if a household can add more tasks
   */
  async canAddTask(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);
    if (limits.maxTasks === -1) return true;

    const currentCount = await this.prisma.task.count({
      where: { householdId },
    });

    return currentCount < limits.maxTasks;
  }

  /**
   * Require the ability to add a task
   */
  async requireCanAddTask(householdId: string): Promise<void> {
    const canAdd = await this.canAddTask(householdId);
    if (!canAdd) {
      const limits = await this.getPlanLimits(householdId);
      throw new ForbiddenException(
        `You have reached the maximum number of tasks (${limits.maxTasks}) for your plan. Please upgrade to add more tasks.`
      );
    }
  }

  /**
   * Check if a household can add more vehicles
   */
  async canAddVehicle(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);
    if (limits.maxVehicles === -1) return true;

    const currentCount = await this.prisma.vehicle.count({
      where: { householdId },
    });

    return currentCount < limits.maxVehicles;
  }

  /**
   * Require the ability to add a vehicle
   */
  async requireCanAddVehicle(householdId: string): Promise<void> {
    const canAdd = await this.canAddVehicle(householdId);
    if (!canAdd) {
      const limits = await this.getPlanLimits(householdId);
      throw new ForbiddenException(
        `You have reached the maximum number of vehicles (${limits.maxVehicles}) for your plan. Please upgrade to add more vehicles.`
      );
    }
  }

  /**
   * Check if a household can add more pets
   */
  async canAddPet(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);
    if (limits.maxPets === -1) return true;

    const currentCount = await this.prisma.pet.count({
      where: { householdId },
    });

    return currentCount < limits.maxPets;
  }

  /**
   * Require the ability to add a pet
   */
  async requireCanAddPet(householdId: string): Promise<void> {
    const canAdd = await this.canAddPet(householdId);
    if (!canAdd) {
      const limits = await this.getPlanLimits(householdId);
      throw new ForbiddenException(
        `You have reached the maximum number of pets (${limits.maxPets}) for your plan. Please upgrade to add more pets.`
      );
    }
  }

  /**
   * Check if a household can add more employees
   */
  async canAddEmployee(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);

    // Check feature availability first
    if (!limits.features.employees) {
      return false;
    }

    if (limits.maxEmployees === -1) return true;

    const currentCount = await this.prisma.employee.count({
      where: { householdId },
    });

    return currentCount < limits.maxEmployees;
  }

  /**
   * Require the ability to add an employee
   */
  async requireCanAddEmployee(householdId: string): Promise<void> {
    const limits = await this.getPlanLimits(householdId);

    if (!limits.features.employees) {
      throw new ForbiddenException(
        'Employee management is not available on your current plan. Please upgrade to access this feature.'
      );
    }

    const canAdd = await this.canAddEmployee(householdId);
    if (!canAdd) {
      throw new ForbiddenException(
        `You have reached the maximum number of employees (${limits.maxEmployees}) for your plan. Please upgrade to add more employees.`
      );
    }
  }

  /**
   * Check if a household can add more inventory items
   */
  async canAddInventoryItem(householdId: string): Promise<boolean> {
    const limits = await this.getPlanLimits(householdId);
    if (limits.maxInventoryItems === -1) return true;

    const currentCount = await this.prisma.inventoryItem.count({
      where: { householdId },
    });

    return currentCount < limits.maxInventoryItems;
  }

  /**
   * Require the ability to add an inventory item
   */
  async requireCanAddInventoryItem(householdId: string): Promise<void> {
    const canAdd = await this.canAddInventoryItem(householdId);
    if (!canAdd) {
      const limits = await this.getPlanLimits(householdId);
      throw new ForbiddenException(
        `You have reached the maximum number of inventory items (${limits.maxInventoryItems}) for your plan. Please upgrade to add more items.`
      );
    }
  }

  /**
   * Get usage summary for a household
   */
  async getUsageSummary(householdId: string) {
    const limits = await this.getPlanLimits(householdId);
    const subscription = await this.getHouseholdSubscription(householdId);

    const [members, tasks, vehicles, pets, employees, inventoryItems] = await Promise.all([
      this.prisma.userProfile.count({ where: { householdId } }),
      this.prisma.task.count({ where: { householdId } }),
      this.prisma.vehicle.count({ where: { householdId } }),
      this.prisma.pet.count({ where: { householdId } }),
      this.prisma.employee.count({ where: { householdId } }),
      this.prisma.inventoryItem.count({ where: { householdId } }),
    ]);

    return {
      plan: subscription.plan,
      status: subscription.status,
      usage: {
        members: { current: members, max: limits.maxMembers },
        tasks: { current: tasks, max: limits.maxTasks },
        vehicles: { current: vehicles, max: limits.maxVehicles },
        pets: { current: pets, max: limits.maxPets },
        employees: { current: employees, max: limits.maxEmployees },
        inventoryItems: { current: inventoryItems, max: limits.maxInventoryItems },
      },
      features: limits.features,
    };
  }
}
