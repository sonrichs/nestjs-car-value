import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report-dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

  create(user: User, reportDto: CreateReportDto): Promise<Report | null> {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean): Promise<Report | null> {
    const report = await this.repo.findOne({ where: { id } })
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({mileage})
      .limit(3)
      .getRawOne()
  }

  async remove(id: number) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found')
    }
    return this.repo.remove(report);
  }
}
