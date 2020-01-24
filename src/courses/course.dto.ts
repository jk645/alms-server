import { IsString, IsOptional, IsMongoId, IsIn, IsInstance } from 'class-validator';


export class Course {
  _id: string;  // ObjectId
  title: string;
  section: string;
}

export class CourseQuery {
  // All have to be String because they come from the query string of the URL
  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsIn(['createdDate'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderBy?: string;
}
