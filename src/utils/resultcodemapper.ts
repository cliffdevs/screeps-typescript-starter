const NEW_CODE_NOT_MAPPED = 'NEW_CODE_NOT_MAPPED';

export const mapScreepsReturnCode = (resultCode: ScreepsReturnCode): string => {
    switch (resultCode) {
        case OK:
            return 'OK';
        case ERR_NOT_OWNER:
            return 'ERR_NOT_OWNER';
        case ERR_NO_PATH:
            return 'ERR_NO_PATH';
        case ERR_BUSY:
            return 'ERR_BUSY';
        case ERR_NAME_EXISTS:
            return 'ERR_NAME_EXISTS';
        case ERR_NOT_FOUND:
            return 'ERR_NOT_FOUND';
        case ERR_NOT_ENOUGH_RESOURCES:
            return 'ERR_NOT_ENOUGH_RESOURCES';
        case ERR_NOT_ENOUGH_ENERGY:
            return 'ERR_NOT_ENOUGH_ENERGY';
        case ERR_INVALID_TARGET:
            return 'ERR_INVALID_TARGET';
        case ERR_FULL:
            return 'ERR_FULL';
        case ERR_NOT_IN_RANGE:
            return 'ERR_NOT_IN_RANGE';
        case ERR_INVALID_ARGS:
            return 'ERR_INVALID_ARGS';
        case ERR_TIRED:
            return 'ERR_TIRED';
        case ERR_NO_BODYPART:
            return 'ERR_NO_BODYPART';
        case ERR_NOT_ENOUGH_EXTENSIONS:
            return 'ERR_NOT_ENOUGH_EXTENSIONS';
        case ERR_RCL_NOT_ENOUGH:
            return 'ERR_RCL_NOT_ENOUGH';
        case ERR_GCL_NOT_ENOUGH:
            return 'ERR_GCL_NOT_ENOUGH';
        default:
            return NEW_CODE_NOT_MAPPED;
    }
}
