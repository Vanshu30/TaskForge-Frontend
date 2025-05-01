import CreateProjectForm from "@/components/CreateProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <CreateProjectForm />
    </div>
  );
}
