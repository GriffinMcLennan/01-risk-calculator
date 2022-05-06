import assert from "assert";

const zip = (a: any[], b: any[]) => {
    assert(a.length === b.length);

    return a.map((a, i) => [a, b[i]]);
};

export default zip;
