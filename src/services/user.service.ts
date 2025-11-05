import { server$ } from '@builder.io/qwik-city';

export interface GradeMeta {
  firstName: string;
  lastName: string;
  grade: string;
  completed: boolean;
  completedAt: string;
  update_time?: string;
  device?: {
    userAgent: string;
    ip: string;
    platform: string;
  };
}

export interface UpdateGradeMetaResponse {
  message: string;
  metadata: any;
}

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:8080/api/website';

export const updateGradeMeta = server$(
  async (gradeMeta: GradeMeta, token: string): Promise<UpdateGradeMetaResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/grade-meta`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        grade_meta: gradeMeta,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update grade information');
    }

    return response.json();
  }
);

export const getGradeMeta = server$(async (token: string): Promise<GradeMeta | null> => {
  const response = await fetch(`${API_BASE_URL}/user/grade-meta`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.grade_meta || null;
});

