export function createAccountPayload(marketplaceID: string, formalName: string, email: string) {
    return {
      marketplace_uid: marketplaceID,
      data: [
        {
          contact: {
            formal_name: formalName,
            email: email,
          },
        },
      ],
    };
}
export function updateAccountPayload(accountUid: string, updatedFormalName: string) {
    return {
      data: [
        {
            uid: accountUid,
          contact: {
            formal_name: updatedFormalName
          },
        },
      ],
    };
}
export function deactivateAccountPayload(accountUid: string) {
    return {
      data: [
        {
            uid: accountUid,
        },
      ],
    };
}
export function addAccountAliasPayload(accountUid: string, aliasKey: string, aliasType: string) {
    return {
      data: [
        {
            account_uid: accountUid,
            alias_key: aliasKey,
            alias_type: aliasType,
            allow_to_onboard: true
        },
      ],
    };
}