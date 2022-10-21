export class dataResult<dataClass> { 
    pageSize: number = 50;
    page: number = 1;
    itemCount: number = 0;
    totalItemCount: number = 0;
    items: dataClass[] = [];
}

export class serviceResponse<dataClass> { 
    success: boolean = false;
    httpCode: number = 0;
    code: number = 0;
    message: string = '';
    internalMessage: string = '';
    data: dataResult<dataClass> = new dataResult<dataClass>();
}