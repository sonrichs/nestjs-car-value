import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report-dto';

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
    if (!report){
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
