import { DomainEntity } from 'domain-objects';
import Joi from 'joi';

export enum AgentPermission {
  DATA_GET_SHIPMENT_ALL = 'data:get:shipment:*',
  DATA_SET_SHIPMENT_ALL = 'data:set:shipment:*',
}

/**
 * a role specifies the permissions granted to a agent
 */
export interface AgentRole {
  /**
   * a unique identifier for the role
   */
  exid: string;

  /**
   * a displayable name of the role
   */
  name: string;

  /**
   * a displayable description of the role
   */
  description: string;

  /**
   * the permissions assigned to the role
   */
  permissions: AgentPermission[];
}
export class AgentRole extends DomainEntity<AgentRole> implements AgentRole {
  public static unique = ['exid'];
  public static updatable = ['name', 'description', 'permissions'];
  public static nested = {
    permissions: AgentPermission,
  };
}
