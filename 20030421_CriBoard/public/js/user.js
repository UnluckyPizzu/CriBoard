class User {


    constructor(code, nome, tipo) {
        this.code = code;
        this.nome = nome;
        this.tipo = tipo;
    }

    /**
     * converte un json in un user
     */
    static from(json) {
        const u = Object.assign(new User(), json);
        return u;
    }
}

export default User;