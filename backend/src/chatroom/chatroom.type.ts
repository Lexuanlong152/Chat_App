import { Field , ID, ObjectType} from "@nestjs/graphql";
import { User } from "user/user.type";

@ObjectType()
export class Chatroom{ 

    @Field(()=> ID, {nullable: true})
     id ?: string; 

    @Field({nullable: true})
     name ?: string; 

    @Field({nullable: true})
     createdDate ?: Date; 

    @Field({nullable: true})
     ModifiedDate ?: Date; 

    @Field(() => [User], { nullable: true }) // array of user IDs
     users?: User[];

    @Field(() => [Message], { nullable: true }) // array of message IDs
     messages?: Message[];

    
}

@ObjectType()
export class Message {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Chatroom, { nullable: true }) // array of user IDs
  chatroom?: Chatroom;

  @Field(() => User, { nullable: true }) // array of user IDs
  user?: User;
}

