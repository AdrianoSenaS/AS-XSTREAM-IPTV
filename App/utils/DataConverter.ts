
export function DataConverter(date:string, locate:string){
    const _date:Date = new Date(date);
    const _newDate:string =  _date.toLocaleDateString(locate)
    return _newDate;
}