export type Vote = {
  id: string;
  pitchId: string;
  evaluatorId?: string | null;
  ipAddress?: string | null;
  innovation: number;
  viability: number;
  impact: number;
  presentation: number;
  comment?: string | null;
  createdAt: Date;
};
