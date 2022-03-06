import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Paging } from '../model/Paging';
import { FindProps, ListProps, CountProps } from '../model/Query';
import { IBaseController } from './IBaseController';

export class BaseHttpController<T> implements IBaseController<T> {
  protected serviceURL: string;
  protected basePath: string;
  protected client: AxiosInstance;

  public constructor(serviceURL: string, basePath: string, client: AxiosInstance) {
    this.serviceURL = serviceURL;
    this.basePath = basePath;
    this.client = client;
  }

  async get(id: string): Promise<T> {
    return this.doGet({ path: id }).then((res) => res.data);
  }

  async find(params: FindProps<T>): Promise<T[]> {
    return this.doPost({ path: 'find', body: params }).then((res) => res.data);
  }

  async list(params: ListProps<T>): Promise<Paging<T>> {
    return this.doPost({ path: 'filter', body: params }).then((res) => res.data);
  }

  async delete(id: string): Promise<T> {
    return this.doDelete({ path: id }).then((res) => res.data);
  }

  async count(params: CountProps<T>): Promise<number> {
    return this.doGet({ path: 'count', config: { params } }).then((res) => res.data);
  }
  async upsert(t: Partial<T>): Promise<T> {
    return this.doPost({ body: t }).then((res) => res.data);
  }

  async bulkUpsert(props: { list: T[] }): Promise<T[]> {
    return this.doPost({ path: 'bulk-upsert', body: props }).then((res) => res.data);
  }

  doGet({ path, config }: { path?: string; config?: AxiosRequestConfig }) {
    return this.client.get(`${this.serviceURL}/${this.basePath}/${path}`, config);
  }

  doPost({ path, body, config }: { path?: string; body?: any; config?: AxiosRequestConfig }) {
    return this.client.post(`${this.serviceURL}/${this.basePath}/${path}`, body, config);
  }

  doPut({ path, body, config }: { path?: string; body?: any; config?: AxiosRequestConfig }) {
    return this.client.put(`${this.serviceURL}/${this.basePath}/${path}`, body, config);
  }

  doPatch({ path, body, config }: { path?: string; body?: any; config?: AxiosRequestConfig }) {
    return this.client.patch(`${this.serviceURL}/${this.basePath}/${path}`, body, config);
  }

  doDelete({ path, config }: { path?: string; body?: any; config?: AxiosRequestConfig }) {
    return this.client.delete(`${this.serviceURL}/${this.basePath}/${path}`, config);
  }
}
