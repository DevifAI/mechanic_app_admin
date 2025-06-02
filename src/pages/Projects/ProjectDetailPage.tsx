import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById } from "../../apis/projectsApi";
import { FaArrowLeft } from "react-icons/fa";

interface Customer {
  id: string;
  partner_name: string;
}

interface Equipment {
  id: string;
  equipment_name: string;
}

interface StaffMember {
  id: string;
  emp_name: string;
  role_id: string;
  role: {
    name: string;
  };
}

interface Revenue {
  id: string;
  revenue_code: string;
  revenue_description: string;
}

interface StoreLocation {
  id: string;
  store_code: string;
  store_name: string;
}

interface Project {
  id: string;
  project_no: string;
  customer_id: string;
  order_no: string;
  contract_tenure: string;
  contract_start_date: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  equipments: Equipment[];
  staff: StaffMember[];
  revenues: Revenue[];
  store_locations: StoreLocation[];
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!id) throw new Error("No project ID provided");
        const data = await fetchProjectById(id) as unknown as Project;
        setProject(data);
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-gray-600">Project not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </button>

          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-blue-600 font-bold">#</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {project.project_no}
              </h1>
              <p className="text-sm text-gray-500">
                {project.customer.partner_name}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Basic Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-gray-800 font-medium">{project.order_no || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Contract Start</p>
                <p className="text-gray-800 font-medium">
                  {project.contract_start_date ? formatDate(project.contract_start_date) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Tenure</p>
                <p className="text-gray-800 font-medium">{project.contract_tenure || '-'}</p>
              </div>
            </div>
          </div>

          {/* Revenues Section */}
          {project.revenues.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.revenues.map((revenue) => (
                  <div key={revenue.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{revenue.revenue_code}</p>
                    <p className="text-sm text-gray-600">{revenue.revenue_description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipments Section */}
          {project.equipments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Equipments ({project.equipments.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.equipments.map((equipment) => (
                  <div key={equipment.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{equipment.equipment_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Section */}
          {project.staff.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Staff ({project.staff.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.staff.map((member) => (
                  <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium">{member.emp_name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {member.role?.name.toLowerCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Section */}
          {project.store_locations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Locations ({project.store_locations.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.store_locations.map((location) => (
                  <div key={location.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{location.store_name}</p>
                    <p className="text-sm text-gray-600">{location.store_code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;