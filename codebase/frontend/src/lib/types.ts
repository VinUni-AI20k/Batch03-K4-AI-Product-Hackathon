export interface Scene {
  id: string;
  type: 'slide' | 'code' | 'dashboard' | 'mindmap' | 'quiz' | 'game';
  title: string;
}

export interface Peer {
  initial: string;
  name: string;
  role: string;
  desc: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'peer';
  text: string;
  avatar: string;
  name: string;
  showPlay?: boolean;
}

export interface LoadingStep {
  label: string;
  from: number;
  to: number;
}

export interface MindmapBranch {
  name: string;
  angle: number;
  leaves: string[];
}

export interface MindmapData {
  root: string;
  branches: MindmapBranch[];
}
