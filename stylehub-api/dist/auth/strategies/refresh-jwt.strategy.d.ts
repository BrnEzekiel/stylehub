import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const RefreshJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshJwtStrategy extends RefreshJwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
