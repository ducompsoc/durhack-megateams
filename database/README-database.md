[Database Guidelines Pulled From Here](https://dev.to/ovid/database-naming-standards-2061)

# Database Rules

- Use underscore_names instead of CamelCase
- Table names should be plural
- Spell out id fields (item_id instead of id)
- Don't use ambiguous column names
- When possible, name foreign key columns the same as the columns they refer to

# User, Team, Megateam relationship

Each user can create or join a team

Each team can enter what area they are working at

Each area is associated with a megateam

User -> Team -> Area -> Megateam

## Notes

- If a user changes team, their points would change to be added to that team
- If a team changed area, their points would change to be added to that area's megateam
  > After initially selecting a location, the only people that can reassign locations/megateams for a team would be volunteers and admin users (see [#3](https://github.com/ducompsoc/durhack-megateams/issues/3), [#4](https://github.com/ducompsoc/durhack-megateams/issues/4))
  > \- [tameTNT](https://github.com/ducompsoc/durhack-megateams/commit/adc509d79f99c4e7d4cd88d3944f34c28bfc0da7#r116757013)
- Will people abuse this lol?

# Points Table Logic Flow

```sql
CREATE TABLE `qrcodes` (
    `qrcode_id` int NOT NULL AUTO_INCREMENT,
    `qrcode_file_location` varchar(255) DEFAULT NULL,
    `qrcode_points_value` int NOT NULL,
    `qrcode_use_limit` int NOT NULL,
    `qrcoded_user_limit` int NOT NULL,
    `state` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`qrcode_id`)
);

CREATE TABLE `points` (
    `point_id` int NOT NULL AUTO_INCREMENT,
    `points_added` int NOT NULL,
    `manual_entry_admin_user_id` int DEFAULT NULL,
    `qrcode_id` int DEFAULT NULL,
    `redeemer_user_id` int NOT NULL,
    PRIMARY KEY (`point_id`),
    FOREIGN KEY (`manual_entry_admin_user_id`) REFERENCES `users`(`user_id`)
    FOREIGN KEY (`redeemer_user_id`) REFERENCES `users`(`user_id`)
    FOREIGN KEY (`qrcode_id`) REFERENCES `qrcodes`(`crcode_id`)
);
```

## Create QR Code

Required:

- points value
- use limit
- user limit

Optional

- file location
- state (can be redeemed)

## Redeem Points (QR Code)

Required:

- QR Code ID
- User ID redeeming

Backend Requirements:

- Retrieve Points Amount of QR Code and pass in SQL Insert Statement

## Redeem Points (Manual)

Required:

- Points Amount
- Admin User ID (requires auth probs)
- User ID 'redeeming' (selects which team/megateam to affect)
