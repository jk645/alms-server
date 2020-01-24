import * as mongoose from 'mongoose';


export const CourseSchema = new mongoose.Schema({
  title: String,
  section: String,
}, {
  collection: 'courses'
});
