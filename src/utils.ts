const LEN = 7;

export const generate = () => {
    const subset = "PASDFGHJKqwerty3456uiomQWERTYUIOLZXCpasdfghjklzxcvbnVBNM127890"

    let id = "";

    for(let i = 0 ; i < LEN ; i++)
        id+=subset[Math.floor(Math.random() * subset.length)];

    return id;
}