import { Module } from "@nestjs/common";

import { TierModule } from "./tier/tier.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { BalanceModule } from "./balance/balance.module";
import { TransactionModule } from "./transactions/transaction.module";
import { S3Module } from "../external/s3/s3.module";
import { LotTagModule } from "./lot-tag/lot-tag.module";
import { LotPhotoModule } from "./lot-photo/lot-photo.module";
import { BidModule } from "./bid/bid.module";
import { LotModule } from "./lot/lot.module";

@Module({
    imports: [
        TierModule,
        UserModule,
        RoleModule,
        BalanceModule,
        TransactionModule,
        S3Module,
        LotTagModule,
        LotPhotoModule,
        BidModule,
        LotModule,
    ],
})
export class ApplicationModule { }