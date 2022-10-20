class Avviso {
    constructor(content) {
        this.contenuto = content;
    }

    /**
     * converte un json in un avviso
     */
    static from(json) {
        const a = Object.assign(new Avviso(), json);
        return a;
    }
}

export default Avviso;