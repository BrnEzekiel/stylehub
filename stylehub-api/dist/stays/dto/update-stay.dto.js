"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStayDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_stay_dto_1 = require("./create-stay.dto");
class UpdateStayDto extends (0, swagger_1.PartialType)(create_stay_dto_1.CreateStayDto) {
}
exports.UpdateStayDto = UpdateStayDto;
//# sourceMappingURL=update-stay.dto.js.map