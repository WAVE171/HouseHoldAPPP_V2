import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChildDto, UpdateChildDto, ChildResponseDto } from './dto';

@Injectable()
export class KidsService {
  constructor(private prisma: PrismaService) {}

  async createChild(householdId: string, dto: CreateChildDto): Promise<ChildResponseDto> {
    const child = await this.prisma.child.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname,
        photo: dto.photo,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        bloodType: dto.bloodType,
        allergies: dto.allergies || [],
        medicalConditions: dto.medicalConditions || [],
        householdId,
      },
    });
    return this.mapChild(child);
  }

  async getChildren(householdId: string): Promise<ChildResponseDto[]> {
    const children = await this.prisma.child.findMany({
      where: { householdId },
      orderBy: { firstName: 'asc' },
    });
    return children.map((c) => this.mapChild(c));
  }

  async getChild(householdId: string, childId: string): Promise<ChildResponseDto> {
    const child = await this.prisma.child.findFirst({
      where: { id: childId, householdId },
    });
    if (!child) throw new NotFoundException('Child not found');
    return this.mapChild(child);
  }

  async updateChild(
    householdId: string,
    childId: string,
    dto: UpdateChildDto,
  ): Promise<ChildResponseDto> {
    const existing = await this.prisma.child.findFirst({
      where: { id: childId, householdId },
    });
    if (!existing) throw new NotFoundException('Child not found');

    const child = await this.prisma.child.update({
      where: { id: childId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname,
        photo: dto.photo,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        bloodType: dto.bloodType,
        allergies: dto.allergies,
        medicalConditions: dto.medicalConditions,
      },
    });
    return this.mapChild(child);
  }

  async deleteChild(householdId: string, childId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.child.findFirst({
      where: { id: childId, householdId },
    });
    if (!existing) throw new NotFoundException('Child not found');

    await this.prisma.child.delete({ where: { id: childId } });
    return { success: true };
  }

  private mapChild(child: any): ChildResponseDto {
    return {
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      nickname: child.nickname || undefined,
      photo: child.photo || undefined,
      dateOfBirth: child.dateOfBirth?.toISOString() || undefined,
      gender: child.gender || undefined,
      bloodType: child.bloodType || undefined,
      allergies: child.allergies || [],
      medicalConditions: child.medicalConditions || [],
      householdId: child.householdId,
      createdAt: child.createdAt.toISOString(),
      updatedAt: child.updatedAt.toISOString(),
    };
  }
}
