import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFromStorage, saveToStorage, KEYS } from '@/lib/storage';
import { Student } from '@/types/canteen';
import { toast } from 'sonner';
import { UserPlus, Users } from 'lucide-react';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    studentId: '',
    name: '',
    college: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const loadedStudents = getFromStorage<Student[]>(KEYS.STUDENTS, []);
    setStudents(loadedStudents);
  };

  const handleSelectStudent = (studentId: string) => {
    const student = students.find((s) => s.studentId === studentId);
    if (student) {
      setSelectedStudent(student);
      setFormData(student);
      saveToStorage(KEYS.CURRENT_STUDENT, student);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedStudent) {
      const updatedStudents = students.map((s) =>
        s.studentId === selectedStudent.studentId ? formData : s
      );
      setStudents(updatedStudents);
      saveToStorage(KEYS.STUDENTS, updatedStudents);
      toast.success('Student updated successfully');
    } else {
      const newStudent = {
        ...formData,
        studentId: formData.studentId || `S${Date.now()}`,
      };
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      saveToStorage(KEYS.STUDENTS, updatedStudents);
      toast.success('Student added successfully');
    }

    setSelectedStudent(formData);
    saveToStorage(KEYS.CURRENT_STUDENT, formData);
    setIsEditing(false);
  };

  const handleNewStudent = () => {
    setSelectedStudent(null);
    setFormData({
      studentId: '',
      name: '',
      college: '',
    });
    setIsEditing(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
            <p className="text-muted-foreground">Select or create student profiles</p>
          </div>
          <Button onClick={handleNewStudent}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Student
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Select Student
              </CardTitle>
              <CardDescription>Choose from existing students</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.studentId} value={student.studentId}>
                      {student.name} - {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedStudent && !isEditing && (
                <div className="mt-6 space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">College</p>
                    <p>{selectedStudent.college}</p>
                  </div>
                  {selectedStudent.email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{selectedStudent.email}</p>
                    </div>
                  )}
                  {selectedStudent.preferences && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferences</p>
                      <p>{selectedStudent.preferences}</p>
                    </div>
                  )}
                  <Button onClick={() => setIsEditing(true)} className="w-full mt-4">
                    Edit Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? (selectedStudent ? 'Edit Student' : 'Create New Student') : 'Student Details'}
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Enter student information' : 'Select a student to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="college">College *</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferences">Food Preferences</Label>
                    <Input
                      id="preferences"
                      placeholder="e.g., Vegetarian"
                      value={formData.preferences}
                      onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Save</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Select a student or create a new one
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
