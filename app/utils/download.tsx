export const downloadJSON = (filename: string, data: any) => {
    // const obj = instances[current].toJSON();
    const jsonString = JSON.stringify(data);
    console.log(jsonString);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};