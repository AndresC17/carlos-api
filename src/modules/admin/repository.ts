import { IUser } from '../user/model';
import { database } from '../../database/database';
import { IQueryResponse } from '../../interfaces/query_responses';

class AdminsRepository {

    private table: string = 'users';

    public signup = async (user: IUser): Promise<IQueryResponse> => {

        return database.query(
            `insert into ${this.table}(first_name, last_name, email, password, role) values('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', 1) RETURNING *`
        )
            .then((value: any) => {
                return {
                    ok: true,
                    data: value[0]
                }
            })
            .catch((err) => {
                return {
                    ok: false,
                    data: err.message
                }
            });
    }

    public login = async (email: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE email = '${email}' AND role = 1`
        ).then((value: any) => {

            console.log(value);

            if (!value) return {
                ok: false,
                data: 'email or password does\'not match'
            }

            return {
                ok: true,
                data: value[0],
            }

        }).catch((err) => {

            return {
                ok: false,
                data: err.message
            }

        });
    }

    public getAll = async (): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE role = 1`
        ).then((value) => {
            return {
                ok: true,
                data: value,
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message,
            }
        });
    }

    public getById = async (id: string): Promise<IQueryResponse> => {

        return database.query(
            `SELECT * FROM ${this.table} WHERE id = '${id}' AND role = 1`
        ).then((value: any) => {

            if (!value) return {
                ok: false,
                data: 'user not found'
            }

            else return {
                ok: true,
                data: value[0],
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public update = async (id: string, user: IUser): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE ${this.table} SET
                first_name = '${user.first_name}',
                last_name = '${user.last_name}',
                email = '${user.email}'
             WHERE id = '${id}' AND role = 1`
        ).then(async (value: any) => {

            console.log(value);

            if (!value) return {
                ok: false,
                data: 'user not found'
            }

            const user = await this.getById(id);
            if (!user.ok) return user;

            return {
                ok: true,
                data: user.data
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }

    public delete = async (id: string): Promise<IQueryResponse> => {

        return database.query(
            `delete from ${this.table} WHERE id = '${id}' AND role = 1`
        ).then((value: any) => {
            if (!value) return {
                ok: false,
                data: 'user not found'
            }
            else return {
                ok: true,
                data: value[0],
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }
}

export const adminsRepository = new AdminsRepository;
