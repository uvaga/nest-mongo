import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Roles guard is running');
    console.log(context);
    
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    // console.log(user);
    // if user can perform this permission
    // manager, accountant, author
    // check the logic for the role her
    return true;
  }
}
