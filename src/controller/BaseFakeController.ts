import { Identifiable } from '../model/Identifiable';
import { Paging, DEFAULT_PAGE_SIZE } from '../model/Paging';
import { FindProps, ListProps, CountProps } from '../model/Query';
import { IBaseController } from './IBaseController';
import { v4 as uuid } from 'uuid';

export class BaseFakeController<T extends Partial<Identifiable>> implements IBaseController<T> {
  listT: T[];

  constructor(listT: T[]) {
    this.listT = listT;
  }

  get(id: string): Promise<T> {
    let t = this.listT.find((item) => item.id === id);
    if (t) return Promise.resolve(t);
    else return Promise.reject(`${id} is not exist`);
  }

  find(params?: FindProps<T> | undefined): Promise<T[]> {
    return Promise.resolve(this.listT);
  }
  list(params?: ListProps<T> | undefined): Promise<Paging<T>> {
    let page = params?.page || 1;
    let pageSize = params?.pageSize || DEFAULT_PAGE_SIZE;
    let search = params?.search?.content || '';
    let searchFields = params?.search?.fields || [];
    let list = this.listT.filter((t) => {
      if (search.length > 0 && searchFields.length > 0) {
        for (let field of searchFields) {
          if (
            (t as any)[field] &&
            String((t as any)[field])
              .toLowerCase()
              .includes(search.toLowerCase())
          )
            return true;
        }
        return false;
      }
      return true;
    });

    return Promise.resolve({
      page: page,
      pageSize: pageSize,
      rows: list.slice(pageSize * (page - 1), pageSize * page),
      total: list.length,
      totalPages: Math.ceil(list.length / pageSize),
    });
  }

  count(params: CountProps<T>): Promise<number> {
    throw new Error('Method not implemented.');
  }

  update(t: T): Promise<T> {
    return this.upsert(t);
  }
  delete(id: string): Promise<T | undefined> {
    if (this.listT.find((item) => item.id === id)) this.listT = this.listT.filter((item) => item.id !== id);
    return Promise.resolve(this.listT.find((item) => item.id === id));
  }

  upsert(t: T): Promise<T> {
    if (t['id'])
      if (this.listT.find((item) => item.id)) {
        this.listT = this.listT.map((item) => (item.id === t.id ? t : item));
        return Promise.resolve(t);
      } else {
        return Promise.resolve(t);
      }
    else {
      const newT = { ...t, id: uuid() };
      this.listT.push(newT);
      return Promise.resolve(newT);
    }
  }

  bulkUpsert(props: { list: T[] }): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
}
