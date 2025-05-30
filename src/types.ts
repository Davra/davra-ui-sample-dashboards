export interface Organisation {
  UUID: string;
  name: string;
  labels?: { [key: string]: string };
  parent?: string;
  ancestors?: string[];
  customAttributes?: any;
  tenantId: string;
}

export interface Metric {
  _id?: string
  name: string
  description?: string
  label: string
  units?: string
  labels?: { [key: string]: string }
  semantics?: string
}