export interface Team {
  id: number;
  team_id: string;
  team_name: string;
  description?: string;
  private?: boolean;
  users?: User[];
}

export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  users: User[]
  private: boolean
}

export interface Project {
  id: number
  project_id: string
  team_id: string
  team?: Team
  project_name: string
  private?: boolean
  description: string
  url: string
}

export type Technology =
  | "wifi"
  | "uart"
  | "jtag"
  | "bluetooth"
  | "lte"
  | "rfid"
  | "nfc"
  | "ant+"
  | "lifi"
  | "zigbee"
  | "z-wave"
  | "lte-advanced"
  | "lora"
  | "nb-iot"
  | "sigfox"
  | "nb-fi"
  | "http"
  | "https"
  | "coap"
  | "mqtt"
  | "amqp"
  | "xmpp"

export type RiskLevel = 1 | 2 | 3

export interface Task {
  task_id: string
  technology: Technology
  name: string
  description: string
  risk_level: RiskLevel
  completed: boolean
  ignored: boolean
}
