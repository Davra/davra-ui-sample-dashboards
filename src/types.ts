export interface Organisation {
  UUID: string;
  name: string;
  labels?: { [key: string]: string };
  parent?: string;
  ancestors?: string[];
  customAttributes?: any;
  tenantId: string;
}
