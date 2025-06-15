export interface GmailMessage {
  id: string;
  threadId: string;
}

export interface GmailListResponse {
  messages: GmailMessage[];
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export interface User {
  id: string;
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  createdAt: Date | null;
}

export interface GmailMessageDetails {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: { name: string; value: string; }[];
    body: { size: number; data?: string; };
  };
  internalDate: string;
  historyId: string;
  sizeEstimate: number;
}

export interface EmailDisplay {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  date: Date;
  isRead: boolean;
}