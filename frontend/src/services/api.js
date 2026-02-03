const API_BASE = `${process.env.REACT_APP_API_BASE_URL}/api/resume`;

/**
 * Upload resume with role selection
 */
export async function uploadResume(file, name, email, phone, roleId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("email", email);
  if (phone) formData.append("phone", phone);
  formData.append("roleId", roleId);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }
  return res.json();
}

/**
 * Get all job roles
 */
export async function getAllRoles() {
  const res = await fetch(`${API_BASE}/roles`);
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

/**
 * Get all candidates
 */
export async function getAllCandidates() {
  const res = await fetch(`${API_BASE}/candidates`);
  if (!res.ok) throw new Error("Failed to fetch candidates");
  return res.json();
}

/**
 * Get candidate by ID
 */
export async function getCandidateById(id) {
  const res = await fetch(`${API_BASE}/candidates/${id}`);
  if (!res.ok) throw new Error("Failed to fetch candidate");
  return res.json();
}

/**
 * Get candidates by role
 */
export async function getCandidatesByRole(roleId) {
  const res = await fetch(`${API_BASE}/candidates/role/${roleId}`);
  if (!res.ok) throw new Error("Failed to fetch candidates for role");
  return res.json();
}

/**
 * Delete candidate
 */
export async function deleteCandidate(id) {
  const res = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete candidate");
  return res.json();
}

/**
 * Update candidate status
 */
export async function updateCandidateStatus(id, status) {
  const res = await fetch(`${API_BASE}/candidates/${id}/status?status=${status}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

/**
 * Test API connection
 */
export async function testAPI() {
  const res = await fetch(`${API_BASE}/test`);
  if (!res.ok) throw new Error("API test failed");
  return res.text();
}