import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from '../features/home/HomePage';
import { ProjectListPage } from '../features/projects/ProjectListPage';
import { ProjectFormPage } from '../features/projects/ProjectFormPage';
import { ProjectDetailPage } from '../features/projects/ProjectDetailPage';
import { NotFoundPage } from '../features/errors/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
